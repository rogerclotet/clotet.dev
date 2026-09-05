import { X } from "lucide-react";
import Title from "@/app/_components/title";
import { getPosts } from "@/lib/blog/posts";
import { getLocale, getTranslations } from "@/lib/i18n/server";
import PreviewList from "../../_components/preview-list";
import TagBadge from "../../_components/tag-badge";

export default async function BlogTag(props: {
	params: Promise<{ tag: string }>;
}) {
	const t = await getTranslations();
	const params = await props.params;
	const posts = getPosts(await getLocale()).filter((post) =>
		post.tags.includes(params.tag),
	);

	return (
		<>
			<Title>{t.blogTitle}</Title>
			<h2 className="text-2xl mt-2">{t.blogDescription}</h2>
			<div className="flex items-center gap-2 my-8">
				{t.filteredBy}
				<TagBadge tag={params.tag} href="/blog">
					<X size={18} aria-label={t.clearFilter} />
				</TagBadge>
			</div>

			<PreviewList posts={posts} />
		</>
	);
}
