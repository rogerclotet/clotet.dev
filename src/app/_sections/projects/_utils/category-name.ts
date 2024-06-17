import type { Project } from "@/lib/projects/projects";

export function getCategoryName(category: Project["category"]) {
  switch (category) {
    case "website":
      return "Website";
    case "webapp":
      return "WebApp";
    case "game":
      return "Game";
  }
}
