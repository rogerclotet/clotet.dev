import { getProjects } from "@/lib/projects/projects";
import Header from "../_components/header";
import Projects from "../_sections/projects";

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <>
      <Header />
      <div className="container mx-auto px-2 lg:px-4 xl:px-8 mb-6 pt-32">
        <Projects />
      </div>
    </>
  );
}
