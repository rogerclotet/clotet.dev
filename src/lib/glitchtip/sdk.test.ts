import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";
import { parseEnvelope } from "@sentry/core";
import * as Sentry from "@sentry/nextjs";
import { onRequestError } from "../../instrumentation";
import { errorOptions } from "./options";

test("the request error hook delivers errors before returning and drops visitor context, standalone messages, and logs", async () => {
	const reports: string[] = [];
	const server = createServer(async (req, res) => {
		let body = "";
		for await (const chunk of req) body += chunk;
		reports.push(body);
		res.writeHead(200).end();
	});
	await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
	const address = server.address();
	assert.ok(address && typeof address === "object");
	Sentry.init({
		...errorOptions,
		dsn: `http://abc123@127.0.0.1:${address.port}/42`,
		enableOpenTelemetrySetup: false,
		includeServerName: false,
		release: "sdk-test",
	});
	try {
		Sentry.setUser({ email: "private@example.com", ip_address: "192.0.2.1" });
		Sentry.addBreadcrumb({ message: "secret" });
		const error = new TypeError(
			"Cannot read properties of undefined (reading 'title')",
		);
		error.stack = `TypeError: ${error.message}\n    at example (/project/.next/server/chunks/app.js:12:34)`;
		await onRequestError(
			error,
			{
				path: "/private?token=secret",
				method: "GET",
				headers: { cookie: "secret", "x-forwarded-for": "192.0.2.1" },
			},
			{ routerKind: "App Router", routePath: "/private", routeType: "render" },
		);
		assert.equal(reports.length, 1, "the hook must wait for error delivery");
		Sentry.captureMessage("secret message");
		Sentry.logger.info("secret log");
		await Sentry.flush(3000);
		assert.equal(reports.length, 1);
		const body = reports[0];
		assert.ok(body);
		for (const privateValue of [
			"secret",
			"private@example.com",
			"192.0.2.1",
			"/private",
			"cookie",
			"trace_id",
		]) {
			assert.ok(!body.includes(privateValue), privateValue);
		}
		assert.ok(body.includes("TypeError"));
		assert.ok(body.includes(error.message));
		assert.ok(body.includes("app:///_next/server/chunks/app.js"));
		assert.equal(
			parseEnvelope(new TextEncoder().encode(body))[1][0]?.[0].type,
			"event",
		);
	} finally {
		Sentry.setUser(null);
		await Sentry.close(1000);
		await new Promise<void>((resolve, reject) =>
			server.close((error) => (error ? reject(error) : resolve())),
		);
	}
});
