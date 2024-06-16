import { Badge } from "@/components/ui/badge";

export default function TagBadge({ tag }: { tag: string }) {
  return (
    <Badge
      variant="secondary"
      className="hover:bg-[hsl(var(--tertiary))] transition-colors duration-200 ease-in"
    >
      {tag}
    </Badge>
  );
}
