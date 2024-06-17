import Title from "@/app/_components/title";
import { cn } from "@/lib/utils";
import { FileDown } from "lucide-react";
import JobDetails from "./components/job-details";
import { workExperience } from "./data";

export default function WorkExperience() {
  return (
    <div>
      <div className="flex flex-wrap gap-4 justify-between items-baseline py-4 border-[hsl(var(--primary-foreground))] border-b-2 mr-4">
        <Title className="pl-6">Work Experience</Title>
        <a
          href="https://gitlab.com/rogerclotet/resume/-/raw/master/resume.pdf"
          target="_blank"
          className="flex gap-2 items-center font-semibold text-lg"
        >
          <FileDown />
          Resume
        </a>
      </div>

      {workExperience.map((job, idx) => (
        <div
          key={idx}
          className={cn(
            "px-4 py-2 lg:px-8 lg:py-4 border-[hsl(var(--primary-foreground))] border-t-2 mt-[-2px] border-b-2",
            {
              "pl-2 ml-2 lg:pl-4 lg:ml-4": idx % 2 === 0,
              "pr-2 mr-2 lg:pr-4 lg:mr-4": idx % 2 !== 0,
              "rounded-tl-lg": idx % 2 !== 0,
              "rounded-tr-lg": idx % 2 === 0,
              "rounded-bl-lg": idx % 2 !== 0,
              "rounded-br-lg": idx % 2 === 0,
              "border-r-2": idx % 2 === 0,
              "border-l-2": idx % 2 !== 0,
            }
          )}
        >
          <JobDetails job={job} />
        </div>
      ))}
    </div>
  );
}
