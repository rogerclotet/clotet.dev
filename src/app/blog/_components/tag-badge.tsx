import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function TagBadge({
	tag,
	href,
	children,
}: {
	tag: string;
	href?: string;
	children?: React.ReactNode;
}) {
	return (
		<Link href={href || `/blog/tag/${tag}`}>
			<Badge
				variant="secondary"
				className="hover:bg-[hsl(var(--tertiary))] text-sm transition-colors duration-200 ease-in"
			>
				#{tag}
				{children && <span className="ml-2">{children}</span>}
			</Badge>
		</Link>
	);
}
