import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { common } from "lowlight";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import gdscript from "./gdscript";

const postsDirectory = path.join(process.cwd(), "src/app/blog/_posts");

export async function getPost(slug: string) {
	const post = getPosts().find((post) => post.slug === slug);

	if (!post) {
		return null;
	}

	const processedContent = await unified()
		.use(remarkParse)
		.use(remarkRehype)
		.use(rehypeHighlight, { languages: { ...common, gdscript: gdscript } })
		.use(rehypeStringify)
		.process(post.content);
	const htmlContent = String(processedContent);

	const related = getPosts()
		.filter(
			(p) =>
				p.slug !== post.slug && post.tags.some((tag) => p.tags.includes(tag)),
		)
		.slice(0, 3);

	return {
		post: {
			...post,
			html: htmlContent,
		},
		related: related,
	};
}

export function getPosts() {
	const fileNames = fs.readdirSync(postsDirectory);
	const allPostsData = fileNames
		.filter((fileName) => fileName.endsWith(".md"))
		.map((fileName) => {
			const fullPath = path.join(postsDirectory, fileName);
			const fileContents = fs.readFileSync(fullPath, "utf8");

			const matterResult = matter(fileContents);

			return {
				title: matterResult.data.title as string,
				description: matterResult.data.description as string,
				slug: matterResult.data.slug as string,
				tags: matterResult.data.tags as string[],
				date: matterResult.data.date as Date,
				content: matterResult.content as string,
			};
		});

	return allPostsData.sort((a, b) => {
		if (a.date < b.date) {
			return 1;
		} else {
			return -1;
		}
	});
}
