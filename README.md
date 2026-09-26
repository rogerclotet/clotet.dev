# clotet.dev

Run `bun install` and `bun run dev` to develop locally. Check changes with
`bun run lint`, `bun run test`, and `bun run build`.

Configure Umami in your deployment environment or `.env.local`:

- `UMAMI_SCRIPT_URL`: the full tracker script URL, including `/script.js`.
- `UMAMI_WEBSITE_ID`: the website ID from Umami.

The tracker loads only when both variables are set. The root layout restricts
collection to `clotet.dev` and `www.clotet.dev`, excluding localhost and preview
deployments.
PostHog remains enabled alongside Umami when `NEXT_PUBLIC_POSTHOG_KEY` is set.

Umami automatically records pageviews, including client-side navigation. Custom
click events use its `data-umami-event` attributes:

- `project-visit` and `project-source`, with the project slug in `project`.
- `social-click`, with `platform` set to `github`, `gitlab`, or `linkedin`.
- `email-click`, with `location` set to `intro` or `outro`.
- `resume-click`, when opening the résumé PDF.

After deploying, visit the site and check pageviews and events in Umami. Browser
ad blockers can prevent collection. See the [Umami event documentation](https://docs.umami.is/docs/track-events)
to add more events.

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
