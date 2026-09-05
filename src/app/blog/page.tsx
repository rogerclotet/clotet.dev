import { getPosts } from "@/lib/blog/posts";
import { getLocale, getTranslations } from "@/lib/i18n/server";
import Title from "../_components/title";
import PreviewList from "./_components/preview-list";
import TagBadge from "./_components/tag-badge";

export default async function Blog() {
	const t = await getTranslations();
	const posts = getPosts(await getLocale());
	const tags = new Set(posts.flatMap((post) => post.tags));

	return (
		<>
			<div className="mb-16 flex flex-wrap items-center justify-between gap-4">
				<div>
					<Title>{t.blogTitle}</Title>
					<h2 className="text-2xl mt-2 ml-1">{t.blogDescription}</h2>
				</div>
				<div className="flex flex-wrap gap-2 lg:max-w-[45%]">
					{Array.from(tags).map((tag) => (
						<TagBadge key={tag} tag={tag} />
					))}
				</div>
			</div>

			<PreviewList posts={posts} />
		</>
	);
}
