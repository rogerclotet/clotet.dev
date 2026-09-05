import Link from "next/link";
import { getPosts } from "@/lib/blog/posts";
import { getLocale, getTranslations } from "@/lib/i18n/server";
import Title from "../_components/title";
import PreviewList from "../blog/_components/preview-list";

export default async function BlogPreview() {
	const t = await getTranslations();
	const posts = getPosts(await getLocale()).slice(0, 4);

	return (
		<div className="flex flex-col p-2 lg:p-6 mb-20 gap-8">
			<div className="flex items-baseline justify-between gap-2">
				<Title>{t.latestArticles}</Title>
				<Link href="/blog" className="text-2xl monospace">
					Blog →
				</Link>
			</div>
			<PreviewList posts={posts} />
		</div>
	);
}
