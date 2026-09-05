export const locales = ["en", "ca", "es"] as const;
export type Locale = (typeof locales)[number];
export const localeCookie = "language";

export const languageNames = {
	en: "English",
	ca: "Català",
	es: "Español",
} satisfies Record<Locale, string>;

export function isLocale(value: unknown): value is Locale {
	return locales.some((locale) => locale === value);
}

export function resolveLocale({
	savedLanguage,
	acceptLanguage,
}: {
	savedLanguage?: string;
	acceptLanguage: string | null;
}): Locale {
	if (isLocale(savedLanguage)) return savedLanguage;

	const preferences = (acceptLanguage ?? "").split(",").map((entry) => {
		const [tag, ...parameters] = entry.trim().toLowerCase().split(";");
		const qualityParameter = parameters.find((parameter) =>
			parameter.trim().startsWith("q="),
		);
		const quality =
			qualityParameter === undefined
				? 1
				: Number(qualityParameter.trim().slice(2));
		return { language: tag.split("-")[0], quality };
	});

	for (const { language } of preferences
		.filter(
			({ quality }) => Number.isFinite(quality) && quality > 0 && quality <= 1,
		)
		.sort((a, b) => b.quality - a.quality)) {
		if (isLocale(language)) return language;
	}
	return "en";
}
