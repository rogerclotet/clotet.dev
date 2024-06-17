import Title from "@/app/_components/title";
import { getProjects } from "@/lib/projects/projects";
import Project from "../projects/_components/project";

export default function Projects() {
  const projects = getProjects();

  return (
    <div className="min-h-[70vh] flex flex-col p-2 lg:p-6 mb-20 gap-6">
      <Title>Projects</Title>
      <p className="text-lg">
        These are some of my personal projects. Most things I develop as side
        projects don&apos;t end up anywhere and only serve as learning
        experiences. Here are some of the ones worth sharing.
      </p>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        {projects.map((project) => (
          <Project key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
