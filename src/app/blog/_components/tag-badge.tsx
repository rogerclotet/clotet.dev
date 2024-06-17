import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function TagBadge({ tag }: { tag: string }) {
  return (
    <Link href={`/blog/tag/${tag}`}>
      <Badge
        variant="secondary"
        className="hover:bg-[hsl(var(--tertiary))] transition-colors duration-200 ease-in"
      >
        {tag}
      </Badge>
    </Link>
  );
}
