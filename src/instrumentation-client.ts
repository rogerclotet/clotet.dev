import * as Sentry from "@sentry/nextjs";
import { errorOptions } from "@/lib/glitchtip/options";

if (
	process.env.NODE_ENV === "production" &&
	process.env.NEXT_PUBLIC_GLITCHTIP_DSN
) {
	Sentry.init({
		...errorOptions,
		dsn: process.env.NEXT_PUBLIC_GLITCHTIP_DSN,
		environment: process.env.NEXT_PUBLIC_GLITCHTIP_ENVIRONMENT || "production",
		tunnel: "/api/error-report",
		replaysSessionSampleRate: 0,
		replaysOnErrorSampleRate: 0,
	});
}
