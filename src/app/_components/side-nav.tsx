"use client";

import React from "react";
import { cn } from "@/lib/utils";

const sections = [
	{ id: "intro", label: "Intro" },
	{ id: "projects", label: "Projects" },
	{ id: "work-experience", label: "Experience" },
	{ id: "outro", label: "Contact" },
];

const HEADER_OFFSET = 104; // h-20 header (80px) + 24px breathing room

export default function SideNav() {
	const [activeSection, setActiveSection] = React.useState("intro");

	React.useEffect(() => {
		function handleScroll() {
			const scrollMid = window.scrollY + window.innerHeight / 2;
			let current = sections[0].id;
			for (const { id } of sections) {
				const element = document.getElementById(id);
				if (element && element.offsetTop <= scrollMid) {
					current = id;
				}
			}
			setActiveSection(current);
		}
		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	function scrollToSection(id: string) {
		if (id === sections[sections.length - 1].id) {
			window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
			return;
		}
		const el = document.getElementById(id);
		if (!el) return;
		const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
		window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
	}

	return (
		<>
			{/* Desktop: text labels connected by lines */}
			<div className="fixed left-4 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-3">
				{sections.map((section, i) => (
					<React.Fragment key={section.id}>
						{i > 0 && (
							<div className="w-px h-6 bg-[hsl(var(--muted-foreground)/0.4)]" />
						)}
						<button
							type="button"
							onClick={() => scrollToSection(section.id)}
							className={cn(
								"text-[10px] font-mono uppercase transition-all duration-300 cursor-pointer",
								activeSection === section.id
									? "text-[hsl(var(--primary-foreground))] font-bold scale-[1.2]"
									: "text-[hsl(var(--muted-foreground))] font-normal scale-100 hover:text-[hsl(var(--foreground))]",
							)}
							style={{ writingMode: "vertical-lr" }}
						>
							{section.label}
						</button>
					</React.Fragment>
				))}
			</div>

			{/* Mobile: bottom gradient bar — mirrors header treatment */}
			<div className="fixed bottom-0 left-0 right-0 z-10 flex lg:hidden justify-center items-end pb-3 pt-10 bg-linear-to-t from-[hsl(var(--background))] from-30% to-transparent">
				<div className="flex items-center gap-3">
					{sections.map((section, i) => (
						<React.Fragment key={section.id}>
							{i > 0 && (
								<div className="h-px w-6 bg-[hsl(var(--muted-foreground)/0.4)]" />
							)}
							<button
								type="button"
								onClick={() => scrollToSection(section.id)}
								className={cn(
									"text-[10px] font-mono uppercase transition-all duration-300 cursor-pointer",
									activeSection === section.id
										? "text-[hsl(var(--primary-foreground))] font-bold scale-[1.15]"
										: "text-[hsl(var(--muted-foreground))] font-normal scale-100 hover:text-[hsl(var(--foreground))]",
								)}
							>
								{section.label}
							</button>
						</React.Fragment>
					))}
				</div>
			</div>
		</>
	);
}
