import type { Metadata } from "next";
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
	return (
		<html lang={locale} className="sr">
			<body>
				<LocaleProvider locale={locale}>
					<TooltipProvider>
						<main>{children}</main>
					</TooltipProvider>
				</LocaleProvider>
			</body>
		</html>
	);
}
