import Title from "@/app/_components/title";
import { Badge } from "@/components/ui/badge";
import { getPosts } from "@/lib/blog/posts";
import { X } from "lucide-react";
import Link from "next/link";
import PreviewList from "../../_components/preview-list";

export default function BlogTag({ params }: { params: { tag: string } }) {
  const posts = getPosts().filter((post) => post.tags.includes(params.tag));

  return (
    <>
      <Title>Dev Learnings</Title>
      <h2 className="text-2xl mt-2">My notes about software development</h2>
      <div className="flex items-center gap-2 my-8">
        Filtered by
        <Link href="/blog">
          <Badge
            variant="secondary"
            className="hover:bg-[hsl(var(--tertiary))] transition-colors duration-200 ease-in text-sm gap-2"
          >
            {params.tag}
            <X size={18} />
          </Badge>
        </Link>
      </div>

      <PreviewList posts={posts} />
    </>
  );
}
