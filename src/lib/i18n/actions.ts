"use server";

import { cookies } from "next/headers";
import { isLocale, localeCookie } from "./locale";

export async function changeLanguage(language: string) {
	if (!isLocale(language)) throw new Error("Unsupported language");
	(await cookies()).set(localeCookie, language, {
		path: "/",
		maxAge: 60 * 60 * 24 * 365,
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
	});
}
