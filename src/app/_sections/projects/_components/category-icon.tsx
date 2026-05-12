import { Gamepad2, Globe, PanelsTopLeft } from "lucide-react";
import type { Project } from "@/lib/projects/projects";

export default function CategoryIcon({
	category,
}: {
	category: Project["category"];
}) {
	switch (category) {
		case "website":
			return <Globe />;
		case "webapp":
			return <PanelsTopLeft />;
		case "game":
			return <Gamepad2 />;
	}
}
