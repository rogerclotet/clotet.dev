import Logo from "@/app/_components/logo";
import { SiGithub, SiGitlab, SiProtonmail } from "@icons-pack/react-simple-icons";

function LinkedinIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function Intro() {
  return (
    <div className="min-h-dvh flex items-center justify-center p-2 lg:p-6">
      <div className="flex flex-wrap md:gap-6 items-center">
        <div className="mb-14 grow">
          <Logo width={50} height={50} />
          <h2 className="pt-2 text-3xl">Roger Clotet</h2>
          <h1 className="pb-4 text-6xl text-[hsl(var(--primary-foreground))]">
            Hello, World!
          </h1>

          <div className="flex gap-4">
            <a href="https://gitlab.com/rogerclotet" target="_blank">
              <SiGitlab size={24} />
            </a>
            <a href="https://github.com/rogerclotet" target="_blank">
              <SiGithub size={24} />
            </a>
            <a href="https://linkedin.com/in/rogerclotet" target="_blank">
              <LinkedinIcon size={24} />
            </a>
<a href="mailto:roger@clotet.dev">
              <SiProtonmail size={24} />
            </a>
          </div>
        </div>

        <div className="text-[hsl(var(--primary-foreground))] text-sm lg:text-lg leading-tight text-right grow">
          <p>I&apos;m a dad and a software engineer based in Girona</p>
          <p>I build stuff for the web and distributed systems</p>
          <p>I love learning, photography, videogames, and driving</p>
        </div>
      </div>
    </div>
  );
}
