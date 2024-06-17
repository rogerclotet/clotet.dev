import { getPosts } from "@/lib/blog/posts";
import Link from "next/link";
import PreviewList from "../blog/_components/preview-list";
import Title from "./title";

export default function BlogPreview() {
  const posts = getPosts().slice(0, 4);

  return (
    <div className="min-h-[70vh] flex flex-col p-2 lg:p-6">
      <div className="flex items-baseline justify-between gap-2">
        <Title>Latest articles </Title>
        <Link href="/blog" className="text-2xl monospace">
          Blog →
        </Link>
      </div>
      <PreviewList posts={posts} />
    </div>
  );
}
