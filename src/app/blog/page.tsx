import { getPosts } from "@/lib/blog/posts";
import Title from "../_components/title";
import PreviewList from "./_components/preview-list";

export default function Blog() {
  const posts = getPosts();

  return (
    <>
      <Title>Dev Learnings</Title>
      <h2 className="text-2xl mt-2">My notes about software development</h2>

      <PreviewList posts={posts} />
    </>
  );
}
