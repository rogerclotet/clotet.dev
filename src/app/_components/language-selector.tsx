"use client";

import { Languages } from "lucide-react";
import { useState, useTransition } from "react";
import { changeLanguage } from "@/lib/i18n/actions";
import { languageNames, locales } from "@/lib/i18n/locale";
import { useLocale, useTranslations } from "@/lib/i18n/provider";

export default function LanguageSelector() {
	const locale = useLocale();
	const t = useTranslations();
	const [pending, startTransition] = useTransition();
	const [hasError, setHasError] = useState(false);

	return (
		<div className="relative">
			<label className="relative grid size-11 place-items-center rounded-sm text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[hsl(var(--primary-foreground))] has-[:disabled]:opacity-50">
				<Languages size={18} aria-hidden="true" />
				<span className="sr-only">{t.language}</span>
				<select
					value={locale}
					disabled={pending}
					aria-busy={pending}
					title={t.language}
					className="absolute inset-0 size-full cursor-pointer border-0 bg-[hsl(var(--background))] text-[hsl(var(--foreground))] opacity-0 disabled:cursor-wait"
					onChange={(event) => {
						const language = event.target.value;
						setHasError(false);
						startTransition(async () => {
							try {
								await changeLanguage(language);
							} catch {
								setHasError(true);
							}
						});
					}}
				>
					{locales.map((language) => (
						<option key={language} value={language} lang={language}>
							{languageNames[language]}
						</option>
					))}
				</select>
			</label>
			{hasError && (
				<p
					role="alert"
					className="absolute right-0 top-full mt-2 w-64 rounded border bg-[hsl(var(--background))] p-3 text-sm"
				>
					{t.languageError}
				</p>
			)}
		</div>
	);
}
