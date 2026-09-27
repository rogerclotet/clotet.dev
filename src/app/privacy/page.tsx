import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations();
	return {
		title: `${t.privacy} - Roger Clotet`,
		alternates: { canonical: "https://clotet.dev/privacy" },
	};
}

export default async function Privacy() {
	const t = await getTranslations();
	return (
		<article className="mx-auto max-w-2xl px-6 py-16 space-y-6">
			<Link href="/" className="underline underline-offset-4">
				{t.home}
			</Link>
			<h1 className="text-4xl font-bold">{t.privacy}</h1>
			<p>{t.privacyTracking}</p>
			<p>{t.privacyPreferences}</p>
			<p>{t.privacyHosting}</p>
			<a
				className="inline-block underline underline-offset-4"
				href="mailto:roger@clotet.dev"
			>
				roger@clotet.dev
			</a>
		</article>
	);
}
