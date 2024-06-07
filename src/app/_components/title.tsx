import { cn } from "@/lib/utils";

export default function Title({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <h1 className={cn("text-[rgb(var(--primary))] text-6xl", className)}>
      {children}
    </h1>
  );
}
