import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import EqCurve from "@/components/EqCurve";
import { site } from "@/data/site";

const textLink = "font-bold text-link underline underline-offset-2 hover:text-ink";
const email = site.links.find(({ label }) => label === "Email")!;
const otherLinks = site.links.filter(({ label }) => label !== "Email");
const featured = site.projects.filter(({ image }) => image);
const others = site.projects.filter(({ image, onHomePage }) => !image && onHomePage);

function Window({
  title,
  id,
  children,
  level = "h2",
}: {
  title: string;
  id?: string;
  children: ReactNode;
  level?: "h2" | "h3";
}) {
  const Heading = level;
  return (
    <section id={id} className="window scroll-mt-4">
      <div className="title-bar">
        <Heading className="font-chrome text-sm md:text-base">{title}</Heading>
        <div className="window-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="p-5 md:p-7">{children}</div>
    </section>
  );
}

function Sparkle({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" fill="#ffffff" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="y2k-page min-h-screen">
      <div className="mx-auto max-w-5xl px-4 pb-10 pt-5 md:px-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="font-pixel text-sm text-ink">
            {site.name}
          </Link>
          <nav aria-label="Main" className="flex flex-wrap gap-1.5 text-xs">
            <a href="#experience" className="silver-button !px-3 !py-1.5">Experience</a>
            <a href="#projects" className="silver-button !px-3 !py-1.5">Projects</a>
            <a href="#about" className="silver-button !px-3 !py-1.5">About</a>
            <Link href="/play" className="aqua-button !px-3 !py-1.5">Play the game</Link>
            <Link href="/quick" className="silver-button !px-3 !py-1.5">Quick version</Link>
          </nav>
        </header>

        <main className="mt-10 space-y-8">
          <div className="relative">
            <Sparkle className="absolute -top-3 right-[6%] h-10 w-10" />
            <Sparkle className="absolute right-[14%] top-16 h-5 w-5" />
            <h1 className="chrome-text font-chrome text-[2.6rem] leading-[1.08] sm:text-6xl lg:text-7xl">
              {site.name}
            </h1>
            <p className="mt-5 max-w-3xl text-lg font-bold leading-snug text-ink md:text-2xl">{site.pitch}</p>
            <p className="mt-3 text-ink">{site.current}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={email.url} className="aqua-button">Email me</a>
              {otherLinks.map(({ label, url }) => (
                <a key={label} href={url} className="silver-button">{label}</a>
              ))}
            </div>
          </div>

          <div className="overflow-hidden border-y-2 border-white/80 bg-ink/90 py-1.5 font-pixel text-sm text-white">
            <div className="ticker">
              {[false, true].map((copy) => (
                <ul key={String(copy)} aria-hidden={copy} className="flex shrink-0">
                  {site.ticker.map((item) => (
                    <li key={item} className="whitespace-nowrap px-6">{item}</li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          <section className="window">
            <div className="title-bar">
              <h2 className="font-pixel text-sm">FabCutie EQ</h2>
              <div className="window-dots" aria-hidden="true"><span /><span /><span /></div>
            </div>
            <div className="lcd p-3 md:p-4">
              <EqCurve />
              <p className="pt-3 font-pixel text-sm leading-relaxed text-[#8df3ff]">
                Drag a point to shape the curve. I built FabCutie, an open-source EQ, to do this properly.
              </p>
            </div>
          </section>

          <Window id="experience" title="Experience">
            <ol className="divide-y divide-rule">
              {site.experience.map((job) => (
                <li
                  key={`${job.company}-${job.dates}`}
                  className="grid gap-x-6 gap-y-1 py-4 first:pt-0 last:pb-0 md:grid-cols-[11rem_1fr]"
                >
                  <p className="font-pixel text-sm leading-relaxed text-muted">{job.dates}</p>
                  <div className="max-w-2xl">
                    <h3 className="font-bold">{job.title}, {job.company}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{job.summary}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Window>

          <section id="projects" className="scroll-mt-4 space-y-6">
            <h2 className="chrome-text font-chrome text-3xl md:text-4xl">Projects</h2>
            {featured.map((project) => (
              <Window key={project.title} title={project.title} level="h3">
                <div className="grid items-center gap-5 md:grid-cols-12">
                  <Image
                    src={project.image}
                    alt={`Screenshot of ${project.title}`}
                    width={1040}
                    height={600}
                    sizes="(min-width: 768px) 55vw, 100vw"
                    className="w-full border-2 border-rule md:col-span-7"
                  />
                  <div className="md:col-span-5">
                    <p className="text-sm leading-relaxed text-muted">{project.summary}</p>
                    <p className="mt-3 font-pixel text-sm leading-relaxed">{project.stack}</p>
                    {project.url && (
                      <a href={project.url} className="aqua-button mt-4 text-sm">
                        See {project.title} on GitHub
                      </a>
                    )}
                  </div>
                </div>
              </Window>
            ))}
            <div className="grid gap-6 md:grid-cols-2">
              {others.map((project) => (
                <Window key={project.title} title={project.title} level="h3">
                  <p className="text-sm leading-relaxed text-muted">{project.summary}</p>
                  <p className="mt-3 font-pixel text-sm leading-relaxed">{project.stack}</p>
                  {project.url && (
                    <a href={project.url} className={`mt-3 inline-block text-sm ${textLink}`}>
                      See {project.title} on GitHub
                    </a>
                  )}
                </Window>
              ))}
            </div>
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            <Window id="about" title="About">
              <p className="leading-relaxed">{site.summary}</p>
              <p className="mt-3 leading-relaxed">{site.interests}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{site.education}</p>
            </Window>
            <Window title="Skills">
              <dl className="space-y-3">
                {site.skills.map(({ area, items }) => (
                  <div key={area}>
                    <dt className="font-bold">{area}</dt>
                    <dd className="text-sm leading-relaxed text-muted">{items}</dd>
                  </div>
                ))}
              </dl>
            </Window>
          </div>

          <Window title="Get in touch">
            <p className="max-w-xl leading-relaxed">
              The best way to reach me is by email. You can also{" "}
              <Link href="/play" className={textLink}>play a small game</Link> that tells you about me.
            </p>
            <a href={email.url} className="aqua-button mt-4">Email me</a>
          </Window>
        </main>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 text-sm">
          <ul className="flex flex-wrap gap-2 font-pixel">
            {site.badges.map(({ label, url }) => (
              <li key={label}>
                {url.startsWith("/") ? (
                  <Link href={url} className="pixel-badge">{label}</Link>
                ) : (
                  <a href={url} className="pixel-badge">{label}</a>
                )}
              </li>
            ))}
          </ul>
          <div className="text-right text-xs">
            <p className="flex justify-end gap-3">
              {otherLinks.map(({ label, url }) => (
                <a key={label} href={url} className={textLink}>{label}</a>
              ))}
            </p>
            <p className="mt-1">Copyright © {new Date().getFullYear()} {site.name}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
