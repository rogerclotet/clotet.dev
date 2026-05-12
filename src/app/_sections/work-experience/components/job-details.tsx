import Image from "next/image";
import type { Job } from "../data";

export default function JobDetails({ job }: { job: Job }) {
	return (
		<div>
			<div className="flex items-center gap-3 py-2">
				<Image src={job.logo} alt={job.company} width={40} height={40} />
				<h2 className="text-[hsl(var(--secondary))] text-3xl">
					<a href={job.url}>{job.company}</a>
				</h2>
			</div>

			<p className="text-2xl text-[hsl(var(--primary-foreground))] monospace">
				{job.title}
			</p>

			<p className="opacity-60 pb-4">{job.period}</p>

			{job.text.split("\n").map((line, idx) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static text split; lines can repeat
				<p key={idx} className="pb-3 text-lg">
					{line}
				</p>
			))}
		</div>
	);
}
