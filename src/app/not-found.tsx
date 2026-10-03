import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "@/lib/i18n/server";
import Header from "./_components/header";

export default async function NotFound() {
	const t = await getTranslations();

	return (
		<>
			<Header showBreadcrumbs={false} />
			<div className="min-h-dvh flex items-center justify-center px-6 py-24">
				<div className="flex max-w-4xl flex-col gap-8 md:flex-row md:items-center md:gap-12">
					<p className="monospace text-[8rem] leading-none text-primary-foreground md:text-[12rem]">
						404
					</p>
					<div>
						<h1 className="text-3xl md:text-4xl">{t.notFound}</h1>
						<p className="mt-4 text-lg text-muted-foreground">
							{t.notFoundDescription}
						</p>
						<Link
							href="/"
							className="monospace mt-6 inline-flex min-h-11 items-center gap-3 rounded-sm text-lg underline decoration-current/40 underline-offset-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground"
						>
							<ArrowLeft size={20} aria-hidden="true" />
							{t.backHome}
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
