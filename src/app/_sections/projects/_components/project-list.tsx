"use client";

import type { Project } from "@/lib/projects/projects";
import ProjectDialog from "./project-dialog";

export default function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
      {projects.map((project) => (
        <div key={project.slug}>
          <ProjectDialog project={project} />
        </div>
      ))}
    </div>
  );
}
