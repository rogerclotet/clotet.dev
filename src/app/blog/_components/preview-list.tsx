"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RevealList } from "next-reveal";
import Link from "next/link";
import TagBadge from "./tag-badge";

export default function PreviewList({ posts }: { posts: any[] }) {
  return (
    <RevealList
      delay={300}
      interval={60}
      className="grid md:grid-cols-2 gap-4 py-8"
    >
      {posts.map((post) => (
        <Card key={post.slug} className="visibility-hidden">
          <CardHeader>
            <CardTitle>
              <Link
                href={`/blog/${post.slug}`}
                className="text-[hsl(var(--primary-foreground))]"
              >
                {post.title}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>{post.description}</CardContent>
          <CardFooter className="gap-2 flex-wrap">
            {post.tags.map((tag: string) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </CardFooter>
        </Card>
      ))}
    </RevealList>
  );
}
