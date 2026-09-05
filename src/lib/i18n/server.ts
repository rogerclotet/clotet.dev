import { cookies, headers } from "next/headers";
import { cache } from "react";
import { localeCookie, resolveLocale } from "./locale";
import { messages } from "./messages";

export const getLocale = cache(async () => {
	const [cookieStore, requestHeaders] = await Promise.all([
		cookies(),
		headers(),
	]);
	return resolveLocale({
		savedLanguage: cookieStore.get(localeCookie)?.value,
		acceptLanguage: requestHeaders.get("accept-language"),
	});
});

export async function getTranslations() {
	return messages[await getLocale()];
}
