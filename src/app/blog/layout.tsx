import type { Metadata } from "next";
import { getTranslations } from "@/lib/i18n/server";
import Header from "../_components/header";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations();
	return {
		title: `${t.blogTitle} - Roger Clotet`,
		description: t.blogDescription,
		alternates: {
			canonical: "https://clotet.dev/blog",
		},
	};
}

export default function BlogLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Header />
			<div className="container mx-auto px-2 lg:px-4 xl:px-8 mb-6 pt-24 md:pt-32">
				{children}
			</div>
		</>
	);
}
