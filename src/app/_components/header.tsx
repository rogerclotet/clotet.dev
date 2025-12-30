"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./logo";

export default function Header() {
  const pathname = usePathname();
  const pathnameParts = pathname.replace(/\/$/g, "").split("/").slice(1, 2);

  return (
    <div className="flex items-center justify-between w-full fixed px-4 pb-4 h-20 bg-linear-to-b from-[hsl(var(--background))] from-30% to-transparent z-10">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-[hsl(var(--foreground))]">
          <Logo width={24} height={24} />
        </Link>
        {pathnameParts.map((part, index) => (
          <div key={index} className="flex items-baseline gap-3">
            <span className="text-[hsl(var(--primary-foreground))] font-bold text-2xl">
              /
            </span>
            <Link
              href={`/${pathnameParts.slice(0, index + 1).join("/")}`}
              className="text-[hsl(var(--foreground))] font-bold monospace text-xl"
            >
              {part}
            </Link>
          </div>
        ))}
      </div>
      <Link href="/" className="text-[hsl(var(--foreground))]">
        <h1 className="text-xl">Roger Clotet</h1>
      </Link>
    </div>
  );
}
