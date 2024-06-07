"use client";

import { RevealWrapper } from "next-reveal";
import React from "react";

export default function Revealing({ children }: { children: React.ReactNode }) {
  return <RevealWrapper>{children}</RevealWrapper>;
}
