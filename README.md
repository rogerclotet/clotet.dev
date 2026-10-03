# clotet.dev

Run `bun install` and `bun run dev` to develop locally. Check changes with
`bun run lint`, `bun run test`, and `bun run build`.

The site does not collect audience or product analytics. Optional GlitchTip
reporting captures browser, server, and edge errors using `@sentry/nextjs`, the
[SDK recommended by GlitchTip](https://glitchtip.com/sdkdocs/javascript-nextjs/).

Copy `.env.example` to `.env.local` for configuration. Reporting runs only in
production builds with `NEXT_PUBLIC_GLITCHTIP_DSN` set. Development and builds
without a DSN send nothing.

For Vercel, set the following environment variables on the deployment project:

- `NEXT_PUBLIC_GLITCHTIP_DSN`: the project's public DSN, available at build and runtime.
- `NEXT_PUBLIC_GLITCHTIP_ENVIRONMENT`: `production` or `preview`, as appropriate.
- `GLITCHTIP_UPLOAD_SOURCEMAPS=true`: enable uploads during `bun run build`.
- `GLITCHTIP_URL`: the base URL of your GlitchTip instance.
- `GLITCHTIP_ORG` and `GLITCHTIP_PROJECT`: organization and project slugs.
- `GLITCHTIP_AUTH_TOKEN`: an upload token stored as a build secret. Never use a
  `NEXT_PUBLIC_` prefix or commit this token.
- `GLITCHTIP_RELEASE`: a unique commit SHA. On Vercel this defaults to
  `VERCEL_GIT_COMMIT_SHA`.

Source maps upload from the deployment build, then are deleted from its output.
Missing upload configuration or a failed upload fails the build. The GitHub
Actions checks do not need secrets or upload maps, since Vercel produces the
deployed artifacts. If deployment moves to CI, supply these same variables and
the token through CI secrets on the job that builds the deployed artifacts.
Leave the DSN unset for preview deployments if they should not report errors.

Reports retain error types and messages, stack file locations and line/column
numbers, source map debug IDs, event time, release, and environment. Exception
messages are preserved without privacy filtering. Custom exception names become
`Error`. Source maps supply the
code context for debugging. Reports omit users, request data, cookies, headers,
page URLs, breadcrumbs, local variables, tags, and device/browser context.
Tracing, session tracking, replay, logs, metrics, and SDK build telemetry are
disabled; the transport only permits error events.

Browser reports go through `/api/error-report`. It forwards only sanitized error
events to the configured instance, without visitor headers or IP addresses.
GlitchTip sees the application server's network address. Normal hosting access
logs are controlled separately in the hosting provider. The tunnel accepts at
most 64 KiB per request and forwards upstream rate limits.

To verify after deployment, trigger a temporary test exception in a preview
build with reporting enabled. Check that GlitchTip shows the mapped source
location and that the raw event has none of the excluded fields above. No
permanent public test-error endpoint is included.

The site supports English, Catalan, and Spanish. On the first visit, it matches
`Accept-Language` preferences in priority order, including regional variants such
as `ca-ES` and `es-MX`. English is the fallback. The header selector saves an
explicit choice in a cookie for one year, shared across all pages.

Pages render on the server for each request so the content, metadata, and HTML
`lang` attribute use the same language from the first render. URLs stay the same
when switching languages.

Interface translations live in `src/lib/i18n/messages.ts`, and work history is
localized in `src/app/_sections/work-experience/data.ts`. Each English Markdown
file has corresponding `ca/` and `es/` files in the same content directory.
Translations contain the title, description, and body; shared metadata such as
slugs, tags, dates, images, and destination URLs comes from the English original.
Keep code examples unchanged when translating articles. Tests check translation
coverage and language preference matching.
