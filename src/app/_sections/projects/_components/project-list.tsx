"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/projects/projects";
import { cn } from "@/lib/utils";
import ProjectDialog from "./project-dialog";

const PROJECT_PARAM = "project";

export default function ProjectList({ projects }: { projects: Project[] }) {
	const [openSlug, setOpenSlug] = useState<string | null>(null);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const slug = params.get(PROJECT_PARAM);
		if (!slug || !projects.some((p) => p.slug === slug)) return;

		setOpenSlug(slug);
		document
			.getElementById(`project-${slug}`)
			?.scrollIntoView({ behavior: "smooth", block: "center" });
	}, [projects]);

	const handleOpenChange = (slug: string, open: boolean) => {
		setOpenSlug(open ? slug : null);
		const url = new URL(window.location.href);
		if (open) {
			url.searchParams.set(PROJECT_PARAM, slug);
		} else if (url.searchParams.get(PROJECT_PARAM) === slug) {
			url.searchParams.delete(PROJECT_PARAM);
		}
		window.history.replaceState({}, "", url);
	};

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
			{projects.map((project) => (
				<div
					key={project.slug}
					id={`project-${project.slug}`}
					className={cn(project.featured && "lg:col-span-2")}
				>
					<ProjectDialog
						project={project}
						className={cn(
							project.featured &&
								"border-2 border-[hsl(var(--primary-foreground))] shadow-[0_0_24px_hsl(var(--primary-foreground)/0.15)]",
						)}
						open={openSlug === project.slug}
						onOpenChange={(open) => handleOpenChange(project.slug, open)}
					/>
				</div>
			))}
		</div>
	);
}
