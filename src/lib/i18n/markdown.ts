import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Locale } from "./locale";

// Translations contain prose only; URLs, slugs, dates, and tags stay in the original.
export function readLocalizedMarkdown(
	directory: string,
	fileName: string,
	locale: Locale,
) {
	const original = matter(
		fs.readFileSync(path.join(directory, fileName), "utf8"),
	);
	if (locale === "en") return original;
	const translated = matter(
		fs.readFileSync(path.join(directory, locale, fileName), "utf8"),
	);
	const title: unknown = translated.data.title ?? original.data.title;
	const description: unknown = translated.data.description;
	if (
		typeof title !== "string" ||
		typeof description !== "string" ||
		!translated.content.trim()
	) {
		throw new Error(`Invalid ${locale} translation: ${fileName}`);
	}
	const data: typeof original.data = { ...original.data, title, description };
	return { data, content: translated.content };
}
