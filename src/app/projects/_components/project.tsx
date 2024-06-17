import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Project } from "@/lib/projects/projects";
import Image from "next/image";
import { getCategoryName } from "../_utils/category-name";
import CategoryIcon from "./category-icon";
import ProjectLinks from "./project-links";
import ProjectPreview from "./project-preview";

export default function Project({ project }: { project: Project }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ProjectPreview project={project} className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="gap-0">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[hsl(var(--primary-foreground))]">
            {project.title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col project">
          <div className="text-muted-foreground flex flex-row items-center gap-2">
            {getCategoryName(project.category)}
            <CategoryIcon category={project.category} />
            {project.date.getFullYear()}
          </div>
          <div dangerouslySetInnerHTML={{ __html: project.content }} />
          <Image
            src={project.image}
            alt={project.title}
            width={500}
            height={300}
            className="mx-auto"
          />
        </div>
        <DialogFooter>
          <ProjectLinks project={project} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
