import type { Metadata } from "next";
import Link from "next/link";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/lib/i18n/provider";
import { getLocale, getTranslations } from "@/lib/i18n/server";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations();
	return {
		title: "Roger Clotet",
		description: `${t.bio}. ${t.building}. ${t.interests}.`,
		icons: [{ rel: "icon", url: "/favicon.png" }],
		alternates: {
			canonical: "https://clotet.dev",
		},
	};
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const locale = await getLocale();
	const t = await getTranslations();
	return (
		<html lang={locale} className="sr">
			<body>
				<LocaleProvider locale={locale}>
					<TooltipProvider>
						<main>{children}</main>
						<footer className="px-6 py-8 text-center text-sm">
							<Link href="/privacy" className="underline underline-offset-4">
								{t.privacy}
							</Link>
						</footer>
					</TooltipProvider>
				</LocaleProvider>
			</body>
		</html>
	);
}
