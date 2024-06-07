import Title from "@/app/_components/title";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";

function MailLink({ className }: { className?: string }) {
  return (
    <div className={cn("flex gap-6 items-center", className)}>
      <div className="w-full h-px border-[rgb(var(--primary))] border-b-2" />
      <a
        href="mailto:roger@clotet.dev"
        className="flex items-center gap-2 font-semibold text-lg"
      >
        <Mail /> roger@clotet.dev
      </a>
    </div>
  );
}

export default function Outro() {
  return (
    <div className="min-h-dvh flex flex-col justify-center p-2 lg:p-6">
      <Title className="mb-8">That&apos;s it!</Title>
      <p>
        I&apos;m always working in side projects and willing to collaborate.
      </p>

      <MailLink className="hidden lg:flex" />

      <p>Feel free to get in touch!</p>

      <MailLink className="flex lg:hidden mt-4" />
    </div>
  );
}
