import type { Project } from "@/lib/projects/projects";
import { SiGitlab } from "@icons-pack/react-simple-icons";
import { ExternalLink } from "lucide-react";

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
          <SiGitlab size={16} />
          Source code
        </a>
      )}
    </div>
  );
}
