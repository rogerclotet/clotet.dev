import Title from "@/app/_components/title";
import { getPost } from "@/lib/blog/posts";
import Link from "next/link";
import { redirect } from "next/navigation";
import TagBadge from "../_components/tag-badge";
import "../highlight.css";

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
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
