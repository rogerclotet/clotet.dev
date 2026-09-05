"use client";

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "@/lib/i18n/provider";
import type { Project } from "@/lib/projects/projects";
import CategoryIcon from "./category-icon";
import ProjectLinks from "./project-links";

export default function ProjectPreview({
	project,
	className,
}: {
	project: Project;
	className?: string;
}) {
	const t = useTranslations();
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="flex flex-row items-center justify-between gap-4 text-[hsl(var(--primary-foreground))]">
					{project.title}{" "}
					<TooltipIcon label={t.categories[project.category]}>
						<CategoryIcon category={project.category} />
					</TooltipIcon>
				</CardTitle>
			</CardHeader>
			<CardContent>{project.description}</CardContent>
			<CardFooter>
				<ProjectLinks project={project} />
			</CardFooter>
		</Card>
	);
}

function TooltipIcon({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<Tooltip>
			<TooltipTrigger aria-label={label}>{children}</TooltipTrigger>
			<TooltipContent>{label}</TooltipContent>
		</Tooltip>
	);
}
