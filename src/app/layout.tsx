import type { Metadata } from "next";
import Script from "next/script";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/lib/i18n/provider";
import { getLocale, getTranslations } from "@/lib/i18n/server";
import "./globals.css";
import { CSPostHogProvider } from "./providers";

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
	const umamiScriptUrl = process.env.UMAMI_SCRIPT_URL?.trim();
	const umamiWebsiteId = process.env.UMAMI_WEBSITE_ID?.trim();
	return (
		<html lang={locale} className="sr">
			<body>
				{umamiScriptUrl && umamiWebsiteId && (
					<Script
						src={umamiScriptUrl}
						data-website-id={umamiWebsiteId}
						data-domains="clotet.dev,www.clotet.dev"
						strategy="afterInteractive"
					/>
				)}
				<LocaleProvider locale={locale}>
					<CSPostHogProvider>
						<TooltipProvider>
							<main>{children}</main>
						</TooltipProvider>
					</CSPostHogProvider>
				</LocaleProvider>
			</body>
		</html>
	);
}
