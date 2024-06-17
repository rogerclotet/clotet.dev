"use client";

import {
  Card,
  CardContent,
  CardDescription,
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
      delay={500}
      interval={60}
      className="grid md:grid-cols-2 gap-4 py-8"
    >
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="visibility-hidden"
        >
          <Card>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{post.description}</CardDescription>
            </CardContent>
            <CardFooter className="gap-2 flex-wrap">
              {post.tags.map((tag: string) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </CardFooter>
          </Card>
        </Link>
      ))}
    </RevealList>
  );
}
