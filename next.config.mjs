import { withSentryConfig } from "@sentry/nextjs/config";

// The upload CLI has its own telemetry settings, separate from the build plugin.
process.env.SENTRY_CLI_NO_TELEMETRY = "1";
process.env.SENTRY_CLI_NO_UPDATE_CHECK = "1";

const uploadSourceMaps = process.env.GLITCHTIP_UPLOAD_SOURCEMAPS === "true";
const release =
	process.env.GLITCHTIP_RELEASE || process.env.VERCEL_GIT_COMMIT_SHA;

if (uploadSourceMaps) {
	for (const name of [
		"GLITCHTIP_URL",
		"GLITCHTIP_ORG",
		"GLITCHTIP_PROJECT",
		"GLITCHTIP_AUTH_TOKEN",
		"NEXT_PUBLIC_GLITCHTIP_DSN",
	]) {
		if (!process.env[name])
			throw new Error(`Missing ${name} for GlitchTip source map uploads`);
	}
	if (!release)
		throw new Error(
			"Set GLITCHTIP_RELEASE or VERCEL_GIT_COMMIT_SHA for source map uploads",
		);
}

export default withSentryConfig(
	{},
	{
		sentryUrl: process.env.GLITCHTIP_URL,
		org: process.env.GLITCHTIP_ORG,
		project: process.env.GLITCHTIP_PROJECT,
		authToken: process.env.GLITCHTIP_AUTH_TOKEN,
		telemetry: false,
		silent: !uploadSourceMaps,
		errorHandler: (error) => {
			throw error;
		},
		buildTimeInstrumentation: false,
		routeManifestInjection: false,
		suppressOnRouterTransitionStartWarning: true,
		release: {
			name: release,
			create: uploadSourceMaps,
			finalize: uploadSourceMaps,
			setCommits: false,
		},
		sourcemaps: {
			disable: !uploadSourceMaps,
			deleteSourcemapsAfterUpload: true,
		},
		webpack: {
			automaticVercelMonitors: false,
			treeshake: { removeDebugLogging: true, removeTracing: true },
		},
	},
);
