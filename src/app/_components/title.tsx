import { cn } from "@/lib/utils";

export default function Title({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "text-[hsl(var(--primary-foreground))] text-6xl",
        className
      )}
    >
      {children}
    </h1>
  );
}
