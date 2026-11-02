import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `${site.name} | Quick version`,
  description: `${site.name}: ${site.headline}. Experience, projects, education, and contact links.`,
  alternates: { canonical: "/quick" },
};

const sectionHeading = "text-xl font-semibold mt-10 mb-3";
const link = "underline text-spruce";

export default function Quick() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 min-h-screen">
      <h1 className="text-3xl font-bold">{site.name}</h1>
      <p className="mt-1">{site.headline}</p>
      <p className="mt-4">{site.summary}</p>
      <p className="mt-4 flex flex-wrap gap-4">
        {site.links.map(({ label, url }) => (
          <a key={label} href={url} className={link}>{label}</a>
        ))}
        <Link href="/play" className={link}>Play the game</Link>
      </p>

      <h2 className={sectionHeading}>Experience</h2>
      <ul className="space-y-5">
        {site.experience.map((job) => (
          <li key={`${job.company}-${job.dates}`}>
            <h3 className="font-semibold">{job.title}, {job.company}</h3>
            <p className="text-sm">{job.dates}{job.location && ` · ${job.location}`}</p>
            <p className="mt-1">{job.summary}</p>
          </li>
        ))}
      </ul>

      <h2 className={sectionHeading}>Projects</h2>
      <ul className="space-y-5">
        {site.projects.map((project) => (
          <li key={project.title}>
            <h3 className="font-semibold">
              {project.url ? <a href={project.url} className={link}>{project.title}</a> : project.title}
            </h3>
            <p className="mt-1">{project.summary}</p>
            {project.title === "FabCutie" && (
              <ul className="mt-2 list-disc pl-5 text-sm">
                {site.fabCutieFeatures.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <h2 className={sectionHeading}>Skills</h2>
      <ul className="space-y-1">
        {site.skills.map(({ area, items }) => <li key={area}>{area}: {items}</li>)}
      </ul>

      <h2 className={sectionHeading}>Education</h2>
      <p>{site.education}</p>
      <p className="mt-2">Coursework: {site.courses.join(", ")}.</p>

      <h2 className={sectionHeading}>Interests</h2>
      <p>{site.interests}</p>
    </main>
  );
}
