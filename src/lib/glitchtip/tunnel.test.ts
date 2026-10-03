import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";
import { parseEnvelope } from "@sentry/core";
import { POST } from "../../app/api/error-report/route";

test("the tunnel uses the configured destination and never forwards visitor headers", async () => {
	const received: {
		headers: Record<string, unknown>;
		body: string;
		url?: string;
	}[] = [];
	const server = createServer(async (req, res) => {
		let body = "";
		for await (const chunk of req) body += chunk;
		received.push({ headers: req.headers, body, url: req.url });
		res
			.writeHead(200, { "x-sentry-rate-limits": "60:error:organization" })
			.end();
	});
	await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
	const address = server.address();
	assert.ok(address && typeof address === "object");
	const oldDsn = process.env.NEXT_PUBLIC_GLITCHTIP_DSN;
	const oldEnv = process.env.NODE_ENV;
	process.env.NEXT_PUBLIC_GLITCHTIP_DSN = `http://public-key@127.0.0.1:${address.port}/prefix/42`;
	Object.assign(process.env, { NODE_ENV: "production" });
	try {
		const payload = [
			JSON.stringify({
				dsn: "https://attacker.test/1",
				trace: { transaction: "secret" },
			}),
			JSON.stringify({ type: "event" }),
			JSON.stringify({
				user: { email: "secret" },
				request: { data: "secret" },
				exception: {
					values: [{ type: "Error", value: "Unable to render the article" }],
				},
			}),
		].join("\n");
		const response = await POST(
			new Request("https://site.test/api/error-report", {
				method: "POST",
				body: payload,
				headers: {
					cookie: "secret",
					authorization: "secret",
					"x-forwarded-for": "192.0.2.1",
					"x-real-ip": "192.0.2.1",
					referer: "https://site.test/private",
					"user-agent": "private-browser",
				},
			}),
		);
		assert.equal(response.status, 204);
		assert.equal(
			response.headers.get("x-sentry-rate-limits"),
			"60:error:organization",
		);
		assert.equal(received.length, 1);
		const report = received[0];
		assert.ok(report);
		assert.equal(
			report.url,
			"/prefix/api/42/envelope/?sentry_key=public-key&sentry_version=7",
		);
		for (const header of [
			"cookie",
			"authorization",
			"x-forwarded-for",
			"x-real-ip",
			"referer",
		])
			assert.equal(report.headers[header], undefined);
		assert.notEqual(report.headers["user-agent"], "private-browser");
		assert.ok(!report.body.includes("secret"));
		assert.ok(report.body.includes("Unable to render the article"));
		assert.equal(
			parseEnvelope(new TextEncoder().encode(report.body))[1].length,
			1,
		);

		const large = await POST(
			new Request("https://site.test/api/error-report", {
				method: "POST",
				body: "x".repeat(65537),
			}),
		);
		assert.equal(large.status, 413);
		const invalid = await POST(
			new Request("https://site.test/api/error-report", {
				method: "POST",
				body: "invalid",
			}),
		);
		assert.equal(invalid.status, 400);
		assert.equal(received.length, 1);
	} finally {
		if (oldDsn === undefined) delete process.env.NEXT_PUBLIC_GLITCHTIP_DSN;
		else process.env.NEXT_PUBLIC_GLITCHTIP_DSN = oldDsn;
		if (oldEnv === undefined) Reflect.deleteProperty(process.env, "NODE_ENV");
		else Object.assign(process.env, { NODE_ENV: oldEnv });
		await new Promise<void>((resolve, reject) =>
			server.close((error) => (error ? reject(error) : resolve())),
		);
	}
});
