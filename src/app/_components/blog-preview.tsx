import { getPosts } from "@/lib/blog/posts";
import Link from "next/link";
import PreviewList from "../blog/_components/preview-list";
import Title from "./title";

export default function BlogPreview() {
  const posts = getPosts().slice(0, 2);

  return (
    <div className="min-h-[60vh] flex flex-col p-2 lg:p-6">
      <Title>Latest articles</Title>
      <PreviewList posts={posts} />
      <Link href="/blog" className="text-lg">
        Read blog →
      </Link>
    </div>
  );
}
