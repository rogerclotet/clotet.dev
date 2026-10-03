import * as Sentry from "@sentry/nextjs";

export async function register() {
	if (
		process.env.NODE_ENV !== "production" ||
		!process.env.NEXT_PUBLIC_GLITCHTIP_DSN
	)
		return;
	if (process.env.NEXT_RUNTIME === "nodejs")
		await import("./sentry.server.config");
	if (process.env.NEXT_RUNTIME === "edge") await import("./sentry.edge.config");
}

export async function onRequestError(
	...args: Parameters<typeof Sentry.captureRequestError>
) {
	Sentry.captureRequestError(...args);
	// Keep the request alive while reporting, allowing for the 5s transport timeout.
	await Sentry.flush(6000);
}
