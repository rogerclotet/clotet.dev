import Title from "@/app/_components/title";
import { getProjects } from "@/lib/projects/projects";
import ProjectList from "./_components/project-list";

export default function Projects() {
  const projects = getProjects();

  return (
    <div className="flex flex-col p-2 lg:p-6 mb-20 gap-6">
      <Title>Projects</Title>
      <p className="text-lg">
        These are some of my personal projects. Most things I develop as side
        projects don&apos;t end up anywhere and only serve as learning
        experiences. Here are some of the ones worth sharing.
      </p>
      <ProjectList projects={projects} />
    </div>
  );
}
