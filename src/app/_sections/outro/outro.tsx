import { Mail } from "lucide-react";
import Title from "@/app/_components/title";
import { getTranslations } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

function MailLink({ className }: { className?: string }) {
	return (
		<div className={cn("flex gap-6 items-center", className)}>
			<div className="w-full h-px border-[hsl(var(--primary-foreground))] border-b-2" />
			<a
				href="mailto:roger@clotet.dev"
				className="flex items-center gap-2 font-semibold text-lg"
			>
				<Mail /> roger@clotet.dev
			</a>
		</div>
	);
}

export default async function Outro() {
	const t = await getTranslations();
	return (
		<div className="min-h-dvh flex flex-col justify-center p-2 lg:p-6">
			<Title className="mb-8">{t.outro}</Title>
			<p>{t.collaboration}</p>

			<MailLink className="hidden lg:flex" />

			<p>{t.getInTouch}</p>

			<MailLink className="flex lg:hidden mt-4" />
		</div>
	);
}
