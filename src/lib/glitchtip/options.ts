import { createTransport, type Options } from "@sentry/core";
import { privateErrorEnvelope, privateErrorEvent } from "./privacy";

const errorIntegrations = new Set([
	"EventFilters",
	"InboundFilters",
	"Dedupe",
	"LinkedErrors",
	"BrowserApiErrors",
	"GlobalHandlers",
	"OnUncaughtException",
	"OnUnhandledRejection",
	"DistDirRewriteFrames",
	"NextjsClientStackFrameNormalization",
]);

export const errorOptions = {
	sendClientReports: false,
	attachStacktrace: false,
	maxBreadcrumbs: 0,
	tracePropagationTargets: [],
	// Leave tracesSampleRate/tracesSampler unset to disable tracing entirely.
	beforeSend: privateErrorEvent,
	beforeSendLog: () => null,
	beforeSendMetric: () => null,
	dataCollection: {
		userInfo: false,
		cookies: false,
		httpHeaders: false,
		httpBodies: [],
		urlQueryParams: false,
		stackFrameVariables: false,
		frameContextLines: 0,
	},
	integrations: (defaults) =>
		defaults.filter(({ name }) => errorIntegrations.has(name)),
	transport: (options) => {
		const transport = createTransport(options, async ({ body }) => {
			const response = await fetch(options.url, {
				method: "POST",
				body: typeof body === "string" ? body : new Uint8Array(body),
				headers: { "Content-Type": "application/x-sentry-envelope" },
				credentials: "omit",
				referrerPolicy: "no-referrer",
				keepalive: true,
				signal: AbortSignal.timeout(5000),
			});
			return {
				statusCode: response.status,
				headers: {
					"x-sentry-rate-limits": response.headers.get("x-sentry-rate-limits"),
					"retry-after": response.headers.get("retry-after"),
				},
			};
		});
		return {
			flush: (timeout) => transport.flush(timeout),
			send: (envelope) => {
				const errors = privateErrorEnvelope(envelope);
				return errors[1].length ? transport.send(errors) : Promise.resolve({});
			},
		};
	},
} satisfies Options;
