"use client";

import type { Project } from "@/lib/projects/projects";
import { RevealList } from "next-reveal";
import ProjectDialog from "./project-dialog";

export default function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <RevealList
      delay={600}
      interval={60}
      className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8"
    >
      {projects.map((project) => (
        <div key={project.slug} className="visibility-hidden">
          <ProjectDialog project={project} />
        </div>
      ))}
    </RevealList>
  );
}
