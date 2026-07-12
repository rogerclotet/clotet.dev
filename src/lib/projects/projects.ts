import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export type Project = {
	title: string;
	slug: string;
	description: string;
	category: "website" | "webapp" | "mobileapp" | "game";
	image: string;
	link: string | null;
	repo: string | null;
	date: Date;
	featured: boolean;
	content: string;
};

const projectsDirectory = path.join(
	process.cwd(),
	"src/app/_sections/projects/_projects",
);

export function getProjects(): Project[] {
	const fileNames = fs.readdirSync(projectsDirectory);
	const allProjectsData = fileNames
		.filter((fileName) => fileName.endsWith(".md"))
		.map((fileName) => {
			const fullPath = path.join(projectsDirectory, fileName);
			const fileContents = fs.readFileSync(fullPath, "utf8");

			const matterResult = matter(fileContents);

			const processedContent = unified()
				.use(remarkParse)
				.use(remarkRehype)
				.use(rehypeStringify)
				.processSync(matterResult.content);
			const htmlContent = String(processedContent);

			return {
				title: matterResult.data.title,
				slug: matterResult.data.slug,
				description: matterResult.data.description,
				category: matterResult.data.category,
				image: matterResult.data.image,
				link: matterResult.data.link,
				repo: matterResult.data.repo,
				date: matterResult.data.date,
				featured: matterResult.data.featured ?? false,
				content: htmlContent,
			};
		})
		.sort((a, b) => {
			if (a.featured !== b.featured) {
				return a.featured ? -1 : 1;
			}
			if (a.date < b.date) {
				return 1;
			} else {
				return -1;
			}
		});

	return allProjectsData;
}
