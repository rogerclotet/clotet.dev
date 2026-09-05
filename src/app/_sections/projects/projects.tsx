import Title from "@/app/_components/title";
import { getLocale, getTranslations } from "@/lib/i18n/server";
import { getProjects } from "@/lib/projects/projects";
import ProjectList from "./_components/project-list";

export default async function Projects() {
	const t = await getTranslations();
	const projects = getProjects(await getLocale());

	return (
		<div className="flex flex-col p-2 lg:p-6 mb-20 gap-6">
			<Title>{t.projects}</Title>
			<p className="text-lg">{t.projectsIntro}</p>
			<ProjectList projects={projects} />
		</div>
	);
}
