"use client";

import { SiGithub, SiGitlab } from "@icons-pack/react-simple-icons";
import { ExternalLink } from "lucide-react";
import type { SyntheticEvent } from "react";
import { useTranslations } from "@/lib/i18n/provider";
import type { Project } from "@/lib/projects/projects";

const ignoreTileClick = (event: SyntheticEvent) => {
	event.stopPropagation();
};

export default function ProjectLinks({ project }: { project: Project }) {
	const t = useTranslations();
	return (
		<div className="flex flex-row items-center gap-6">
			{project.link && (
				<a
					href={project.link}
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-2"
					onPointerDown={ignoreTileClick}
					onClick={ignoreTileClick}
				>
					<ExternalLink />
					{t.visit}
				</a>
			)}
			{project.repo && (
				<a
					href={project.repo}
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-2"
					onPointerDown={ignoreTileClick}
					onClick={ignoreTileClick}
				>
					{project.repo.includes("github.com") ? (
						<SiGithub size={16} />
					) : (
						<SiGitlab size={16} />
					)}
					{t.sourceCode}
				</a>
			)}
		</div>
	);
}
