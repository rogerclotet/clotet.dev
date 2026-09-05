import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { getWorkExperience } from "@/app/_sections/work-experience/data";
import { getPost, getPosts } from "@/lib/blog/posts";
import { getProjects } from "@/lib/projects/projects";
import { locales } from "./locale";
import { readLocalizedMarkdown } from "./markdown";

for (const locale of locales) {
	test(`${locale} translates every project and job without changing their identity`, () => {
		const projects = getProjects(locale);
		assert.equal(projects.length, 11);
		assert.deepEqual(
			projects.map(({ slug }) => slug),
			getProjects("en").map(({ slug }) => slug),
		);
		for (const project of projects) {
			assert.ok(project.description.trim());
			assert.match(project.content, /<p>/);
		}
		const jobs = getWorkExperience(locale);
		assert.deepEqual(
			jobs.map(({ company }) => company),
			getWorkExperience("en").map(({ company }) => company),
		);
		for (const job of jobs) {
			assert.ok(job.text.trim());
			assert.ok(job.period.trim());
		}
	});

	test(`${locale} renders all articles and keeps related links valid`, async () => {
		const posts = getPosts(locale);
		assert.equal(posts.length, 7);
		for (const post of posts) {
			const result = await getPost(post.slug, locale);
			assert.ok(result);
			assert.ok(result.post.title.trim());
			assert.ok(result.post.description.trim());
			assert.match(result.post.html, /<pre><code/);
			assert.ok(
				result.related.every(
					(related) =>
						related.slug !== post.slug &&
						posts.some((p) => p.slug === related.slug),
				),
			);
		}
	});
}

test("every Markdown file has both translations and preserves code examples", () => {
	for (const directory of [
		"src/app/blog/_posts",
		"src/app/_sections/projects/_projects",
	]) {
		for (const fileName of fs
			.readdirSync(directory)
			.filter((name) => name.endsWith(".md"))) {
			const original = readLocalizedMarkdown(directory, fileName, "en");
			for (const locale of ["ca", "es"] as const) {
				const translated = readLocalizedMarkdown(directory, fileName, locale);
				assert.notEqual(translated.content, original.content);
				assert.notEqual(translated.data.description, original.data.description);
				assert.equal(translated.data.slug, original.data.slug);
				assert.deepEqual(translated.data.date, original.data.date);
				assert.deepEqual(
					translated.content.match(/```[^\n]*\n[\s\S]*?```/g),
					original.content.match(/```[^\n]*\n[\s\S]*?```/g),
				);
				for (const match of translated.content.matchAll(
					/!\[[^\]]*\]\((\/[^\s)]+)/g,
				)) {
					assert.ok(
						fs.existsSync(path.join("public", match[1])),
						`Missing image: ${match[1]}`,
					);
				}
			}
		}
	}
});
