"use client";

import React from "react";
import ScrollReveal from "scrollreveal";

export default function Revealing({ children }: { children: React.ReactNode }) {
  const container = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof "window" !== undefined && container.current) {
      ScrollReveal().reveal(container.current, { distance: "1rem" });
    }
  }, []);

  return <div ref={container}>{children}</div>;
}
