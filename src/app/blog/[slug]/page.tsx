import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Title from "@/app/_components/title";
import { getPost } from "@/lib/blog/posts";
import TagBadge from "../_components/tag-badge";
import "../highlight.css";

type Params = {
	slug: string;
};

export default async function BlogPost(props: { params: Promise<Params> }) {
	const params = await props.params;
	const postData = await getPost(params.slug);
	if (!postData) {
		return redirect("/blog");
	}

	const { post, related } = postData;

	return (
		<div className="mb-20">
			<Title>{post.title}</Title>
			<div className="flex justify-between items-center gap-4 mt-8">
				<div className="flex flex-wrap gap-2">
					{post.tags.map((tag: string) => (
						<TagBadge key={tag} tag={tag} />
					))}
				</div>

				<span>{post.date.toLocaleDateString()}</span>
			</div>

			<div className="blog-post py-8">
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: server-generated markdown HTML */}
				<div dangerouslySetInnerHTML={{ __html: post.html }} />

				{related.length > 0 && (
					<>
						<h3>Related articles:</h3>
						<ul>
							{related.map((post) => (
								<li key={post.slug}>
									<a href={`/blog/${post.slug}`}>{post.title}</a>
								</li>
							))}
						</ul>
					</>
				)}
			</div>

			<div>
				<Link href="/blog">← More articles</Link>
			</div>
		</div>
	);
}

export async function generateMetadata(
	props: { params: Promise<Params> },
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const params = await props.params;
	const postData = await getPost(params.slug);
	if (!postData) {
		return {};
	}

	const { post } = postData;

	return {
		title: `${post.title} - Roger Clotet`,
		description: post.description,
		alternates: {
			canonical: `https://clotet.dev/blog/${params.slug}`,
		},
	};
}
