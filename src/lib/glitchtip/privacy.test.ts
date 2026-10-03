import assert from "node:assert/strict";
import { test } from "node:test";
import type { Envelope, Event } from "@sentry/core";
import { privateErrorEnvelope, privateErrorEvent } from "./privacy";

const debugId = "7a0e7643-1bc7-4568-bf68-e1da9e2a1912";
const event: Event = {
	event_id: "a".repeat(32),
	timestamp: 1750000000,
	release: "commit-123",
	environment: "production",
	user: { email: "private@example.com", ip_address: "192.0.2.1" },
	request: {
		url: "https://site.test/private?token=secret",
		headers: { Cookie: "secret" },
		data: "secret",
	},
	message: "secret",
	server_name: "private-host",
	contexts: {
		trace: { trace_id: "secret", span_id: "secret" },
		browser: { name: "private" },
	},
	tags: { private: "secret" },
	extra: { private: "secret" },
	breadcrumbs: [{ message: "secret" }],
	exception: {
		values: [
			{
				type: "TypeError",
				value: "Cannot read properties of undefined (reading 'title')",
				mechanism: { type: "secret", handled: false, data: { secret: true } },
				stacktrace: {
					frames: [
						{
							filename:
								"https://site.test/_next/static/chunks/app.js?token=secret#private",
							lineno: 12,
							colno: 34,
							vars: { password: "secret" },
							context_line: "secret",
							function: "secret",
						},
						{
							filename: "/Users/private/project/.next/server/chunks/server.js",
							lineno: 5,
						},
						{ filename: "https://site.test/private?token=secret", lineno: 3 },
						{ filename: "chrome-extension://private/content.js", lineno: 1 },
					],
				},
			},
		],
	},
	debug_meta: {
		images: [
			{
				type: "sourcemap",
				code_file: "https://site.test/_next/static/chunks/app.js?token=secret",
				debug_id: debugId,
			},
		],
	},
};

test("errors keep messages and source map coordinates while excluding visitor context", () => {
	const clean = privateErrorEvent(event);
	assert.ok(clean);
	assert.equal(clean.exception?.values?.[0]?.type, "TypeError");
	assert.equal(
		clean.exception?.values?.[0]?.value,
		event.exception?.values?.[0]?.value,
	);
	assert.deepEqual(clean.exception?.values?.[0]?.stacktrace?.frames, [
		{
			filename: "app:///_next/static/chunks/app.js",
			lineno: 12,
			colno: 34,
			in_app: undefined,
		},
		{
			filename: "app:///_next/server/chunks/server.js",
			lineno: 5,
			colno: undefined,
			in_app: undefined,
		},
	]);
	assert.equal(clean.debug_meta?.images?.[0]?.debug_id, debugId);
	assert.equal(
		clean.debug_meta?.images?.[0]?.code_file,
		clean.exception?.values?.[0]?.stacktrace?.frames?.[0]?.filename,
	);
	assert.equal(clean.release, "commit-123");
	const json = JSON.stringify(clean);
	for (const secret of [
		"secret",
		"private@example",
		"192.0.2.1",
		"private-host",
		"chrome-extension",
		"Users/",
	]) {
		assert.ok(!json.includes(secret), secret);
	}
	for (const field of [
		"user",
		"request",
		"contexts",
		"tags",
		"extra",
		"breadcrumbs",
		"server_name",
		"message",
		"sdkProcessingMetadata",
	]) {
		assert.ok(!(field in clean), field);
	}
	assert.deepEqual(privateErrorEvent(clean), clean);
});

test("arbitrary exception names are not sent", () => {
	const clean = privateErrorEvent({
		exception: { values: [{ type: "secret", value: "private data" }] },
	});
	assert.equal(clean?.exception?.values?.[0]?.type, "Error");
	assert.equal(clean?.exception?.values?.[0]?.value, "private data");
});

test("exception messages are preserved verbatim, including empty messages", () => {
	for (const message of [
		"Failed for private@example.com at https://site.test/?token=abc",
		"",
		"First line\nSecond line",
	]) {
		const clean = privateErrorEvent({
			exception: { values: [{ type: "Error", value: message }] },
		});
		assert.equal(clean?.exception?.values?.[0]?.value, message);
	}
});

test("non-errors and malformed data are dropped", () => {
	for (const value of [
		null,
		{},
		"secret",
		{ message: "secret" },
		{ type: "transaction", exception: event.exception },
		{ exception: { values: [] } },
	]) {
		assert.equal(privateErrorEvent(value), null);
	}
});

test("the final transport boundary removes attachments and envelope trace metadata", () => {
	const envelope: Envelope = [
		{
			event_id: "a".repeat(32),
			sent_at: new Date().toISOString(),
			trace: { transaction: "private URL" },
		},
		[
			[{ type: "event" }, event],
			[{ type: "attachment", length: 6, filename: "private.txt" }, "secret"],
		],
	];
	const clean = privateErrorEnvelope(envelope);
	assert.equal(clean[1].length, 1);
	assert.equal(clean[1][0]?.[0].type, "event");
	assert.ok(!JSON.stringify(clean).includes("secret"));
	assert.ok(!JSON.stringify(clean).includes("private"));
	assert.ok(!("trace" in clean[0]));
});

test("sessions, logs, and transactions cannot leave through the transport", () => {
	const envelopes: Envelope[] = [
		[
			{ sent_at: new Date().toISOString() },
			[
				[
					{ type: "session" },
					{
						sid: "private",
						init: true,
						started: "now",
						timestamp: "now",
						status: "ok",
						errors: 0,
						attrs: { release: "test" },
					},
				],
			],
		],
		[
			{},
			[
				[
					{
						type: "log",
						item_count: 0,
						content_type: "application/vnd.sentry.items.log+json",
					},
					{ items: [] },
				],
			],
		],
		[
			{ event_id: "a".repeat(32), sent_at: new Date().toISOString() },
			[[{ type: "transaction" }, { ...event, type: "transaction" }]],
		],
	];
	for (const envelope of envelopes)
		assert.equal(privateErrorEnvelope(envelope)[1].length, 0);
});
