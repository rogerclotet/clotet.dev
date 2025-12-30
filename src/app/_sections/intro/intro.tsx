import Logo from "@/app/_components/logo";
import {
  SiBluesky,
  SiGithub,
  SiGitlab,
  SiLinkedin,
  SiMastodon,
  SiProtonmail,
  SiX,
} from "@icons-pack/react-simple-icons";

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
              <SiLinkedin size={24} />
            </a>
            <a href="https://mastodon.social/@clotet">
              <SiMastodon size={24} />
            </a>
            <a href="https://bsky.app/profile/clotet.dev" target="_blank">
              <SiBluesky size={24} />
            </a>
            <a href="mailto:roger@clotet.dev">
              <SiProtonmail size={24} />
            </a>
          </div>
        </div>

        <div className="text-[hsl(var(--primary-foreground))] text-sm lg:text-lg leading-tight text-right grow">
          <p>I&apos;m a dad and a software craftsman based in Girona</p>
          <p>I build stuff for the web and distributed systems</p>
          <p>I love learning, photography, videogames, and driving</p>
        </div>
      </div>
    </div>
  );
}
