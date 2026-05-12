import { X } from "lucide-react";
import Title from "@/app/_components/title";
import { getPosts } from "@/lib/blog/posts";
import PreviewList from "../../_components/preview-list";
import TagBadge from "../../_components/tag-badge";

export default async function BlogTag(props: {
	params: Promise<{ tag: string }>;
}) {
	const params = await props.params;
	const posts = getPosts().filter((post) => post.tags.includes(params.tag));

	return (
		<>
			<Title>Dev Learnings</Title>
			<h2 className="text-2xl mt-2">My notes about software development</h2>
			<div className="flex items-center gap-2 my-8">
				Filtered by
				<TagBadge tag={params.tag} href="/blog">
					<X size={18} />
				</TagBadge>
			</div>

			<PreviewList posts={posts} />
		</>
	);
}
