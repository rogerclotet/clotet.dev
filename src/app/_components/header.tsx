"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import Logo from "./logo";

export default function Header() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    function handleScroll() {
      const displayAt = window.innerHeight / 2;
      const distanceFromTop = window.scrollY;

      const shouldBeVisible = distanceFromTop >= displayAt;

      if (isVisible !== shouldBeVisible) {
        setIsVisible(shouldBeVisible);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isVisible]);

  return (
    <div
      className={cn(
        "flex items-center justify-between w-full fixed px-4 pb-4 h-20 transition-all duration-200 ease-in bg-gradient-to-b from-[rgb(var(--background))] from-30% to-transparent z-10",
        {
          "opacity-100 translate-y-0": isVisible,
          "opacity-0 translate-y-[-1em]": !isVisible,
        }
      )}
    >
      <Link href="/" className="text-[rgb(var(--foreground))]">
        <Logo width={24} height={24} />
      </Link>
      <Link href="/" className="text-[rgb(var(--foreground))]">
        <h1 className="text-xl">Roger Clotet</h1>
      </Link>
    </div>
  );
}
