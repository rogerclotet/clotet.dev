"use client";

import React from "react";
import { cn } from "@/lib/utils";

export default function HiddenScroll({
	children,
}: Readonly<{ children: React.ReactNode }>) {
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
				"fixed h-20 left-0 right-0 top-0 transition-all duration-200 ease-in 2xl:from-transparent z-10",
				{
					"opacity-100 translate-y-0": isVisible,
					"opacity-0 translate-y-[-1em]": !isVisible,
				},
			)}
		>
			{children}
		</div>
	);
}
