# clotet.dev

Run `bun install` and `bun run dev` to develop locally. Check changes with
`bun run lint`, `bun run test`, and `bun run build`.

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
