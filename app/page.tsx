import Image from "next/image";
import Link from "next/link";
import EqCurve from "@/components/EqCurve";
import { site } from "@/data/site";

const sectionClass = "mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24";
const sectionTitle = "text-3xl font-semibold tracking-tight md:text-4xl";
const textLink = "underline decoration-rule underline-offset-4 hover:decoration-spruce";

const email = site.links.find(({ label }) => label === "Email")!;
const otherLinks = site.links.filter(({ label }) => label !== "Email");
const featured = site.projects.filter(({ image }) => image);
const others = site.projects.filter(({ image, onHomePage }) => !image && onHomePage);

export default function Home() {
  return (
    <>
      <div className="bg-spruce-deep text-white">
        <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-5 md:px-8">
          <Link href="/" className="font-semibold">{site.name}</Link>
          <nav aria-label="Main" className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <a href="#experience" className="hover:underline">Experience</a>
            <a href="#projects" className="hover:underline">Projects</a>
            <a href="#about" className="hover:underline">About</a>
            <Link href="/play" className="text-mead hover:underline">Play the game</Link>
            <Link href="/quick" className="hover:underline">Quick version</Link>
          </nav>
        </header>

      </div>

      <main>
        <div className="bg-spruce-deep text-white">
          <section className="mx-auto max-w-6xl px-5 pb-10 pt-12 md:px-8 md:pt-20">
            <h1 className="display max-w-5xl text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-8xl">
              {site.name}
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-snug md:text-3xl">{site.pitch}</p>
            <p className="mt-5 text-white/80">{site.current}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={email.url} className="rounded bg-mead px-5 py-3 font-semibold text-ink hover:bg-white">
                Email me
              </a>
              {otherLinks.map(({ label, url }) => (
                <a key={label} href={url} className="rounded border border-white/40 px-5 py-3 hover:border-white">
                  {label}
                </a>
              ))}
            </div>
          </section>
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <EqCurve />
            <p className="pb-6 pt-3 text-sm text-white/75">
              Drag a point to shape the curve. I built{" "}
              <a href="#projects" className="underline underline-offset-4">FabCutie</a>,
              an open-source EQ, to do this properly.
            </p>
          </div>
        </div>

      <section id="experience" className={sectionClass}>
        <h2 className={sectionTitle}>Experience</h2>
        <ol className="mt-10 border-t border-rule">
          {site.experience.map((job) => (
            <li
              key={`${job.company}-${job.dates}`}
              className="grid gap-x-8 gap-y-2 border-b border-rule py-6 md:grid-cols-[12rem_1fr]"
            >
              <p className="text-sm tabular-nums text-muted">{job.dates}</p>
              <div className="max-w-2xl">
                <h3 className="text-lg font-semibold">{job.title}, {job.company}</h3>
                <p className="mt-2 leading-relaxed text-muted">{job.summary}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="projects" className="bg-white">
        <div className={sectionClass}>
          <h2 className={sectionTitle}>Projects</h2>
          <div className="mt-10 space-y-14">
            {featured.map((project) => (
              <article key={project.title} className="grid items-center gap-6 md:grid-cols-12 md:gap-10">
                <Image
                  src={project.image}
                  alt={`Screenshot of ${project.title}`}
                  width={1040}
                  height={600}
                  sizes="(min-width: 768px) 58vw, 100vw"
                  className="w-full rounded border border-rule md:col-span-7"
                />
                <div className="md:col-span-5">
                  <h3 className="text-2xl font-semibold">{project.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{project.summary}</p>
                  <p className="mt-3 text-sm text-muted">{project.stack}</p>
                  {project.url && (
                    <a href={project.url} className={`mt-4 inline-block font-medium text-spruce ${textLink}`}>
                      See {project.title} on GitHub
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
          <ul className="mt-14 grid gap-x-10 gap-y-8 border-t border-rule pt-10 md:grid-cols-2">
            {others.map((project) => (
              <li key={project.title}>
                <h3 className="text-lg font-semibold">
                  {project.url ? (
                    <a href={project.url} className={textLink}>{project.title}</a>
                  ) : project.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted">{project.summary}</p>
                <p className="mt-2 text-sm text-muted">{project.stack}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="about" className={`${sectionClass} grid gap-12 md:grid-cols-2`}>
        <div>
          <h2 className={sectionTitle}>About</h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed">{site.summary}</p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed">{site.interests}</p>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">{site.education}</p>
        </div>
        <div>
          <h2 className={sectionTitle}>Skills</h2>
          <dl className="mt-6 space-y-5">
            {site.skills.map(({ area, items }) => (
              <div key={area}>
                <dt className="font-semibold">{area}</dt>
                <dd className="mt-1 text-muted">{items}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      </main>

      <footer className="bg-spruce text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-8 px-5 py-14 md:px-8">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Get in touch</h2>
            <p className="mt-3 max-w-md text-white/85">
              The best way to reach me is by email. You can also{" "}
              <Link href="/play" className="text-mead underline underline-offset-4">play a small game</Link>{" "}
              that tells you about me.
            </p>
            <a href={email.url} className="mt-5 inline-block rounded bg-mead px-5 py-3 font-semibold text-ink hover:bg-white">
              Email me
            </a>
          </div>
          <div className="text-sm text-white/80">
            <p className="flex gap-4">
              {otherLinks.map(({ label, url }) => (
                <a key={label} href={url} className="underline underline-offset-4">{label}</a>
              ))}
            </p>
            <p className="mt-2">Copyright © {new Date().getFullYear()} {site.name}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
