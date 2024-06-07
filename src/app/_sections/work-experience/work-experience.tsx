import Title from "@/app/_components/title";
import { cn } from "@/lib/utils";
import { FileDown } from "lucide-react";
import JobDetails from "./components/job-details";
import { workExperience } from "./data";

export default function WorkExperience() {
  return (
    <div className="min-h-[80vh]">
      <div className="flex justify-between items-end pb-4 border-[rgb(var(--primary))] border-b-2 mr-4">
        <Title>Work Experience</Title>
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
            "px-8 py-4 border-[rgb(var(--primary))] border-t-2 mt-[-2px] border-b-2",
            {
              "pl-4 ml-4": idx % 2 === 0,
              "pr-4 mr-4": idx % 2 !== 0,
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
