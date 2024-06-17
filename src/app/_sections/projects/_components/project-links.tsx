import type { Project } from "@/lib/projects/projects";
import { ExternalLink, Gitlab } from "lucide-react";

export default function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="flex flex-row items-center gap-6">
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <ExternalLink />
          Visit
        </a>
      )}
      {project.repo && (
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <Gitlab />
          Source code
        </a>
      )}
    </div>
  );
}
