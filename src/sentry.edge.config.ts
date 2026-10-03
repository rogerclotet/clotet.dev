import * as Sentry from "@sentry/nextjs";
import { errorOptions } from "@/lib/glitchtip/options";

Sentry.init({
	...errorOptions,
	dsn: process.env.NEXT_PUBLIC_GLITCHTIP_DSN,
	environment: process.env.NEXT_PUBLIC_GLITCHTIP_ENVIRONMENT || "production",
});
