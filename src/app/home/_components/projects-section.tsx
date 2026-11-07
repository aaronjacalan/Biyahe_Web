import { Eye, Terminal, Grid3X3, MemoryStick as Memory } from "lucide-react";
import { PROJECTS } from "../../../data/portfolio";

const iconMap: Record<string, typeof Eye> = {
  visibility: Eye,
  terminal: Terminal,
  grid_view: Grid3X3,
  memory: Memory,
};

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="flex min-h-dvh flex-col justify-center px-8 md:px-20"
    >
      <h2
        className="mb-2 text-3xl font-bold text-[#1F2720] md:text-4xl"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        PROJECTS
      </h2>
      <p className="mb-10 text-sm text-[#1F2720]/50">
        A collection of things I&apos;ve built.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {PROJECTS.map((project) => {
          const Icon = iconMap[project.icon] ?? Eye;
          return (
            <article
              key={project.id}
              className="group rounded-2xl border border-[#d8cfbf] bg-white/50 p-6 transition-all hover:border-[#1F2720]/30 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#ebe2d5] text-[#1F2720] transition-colors group-hover:bg-[#1F2720] group-hover:text-[#F6F0E3]">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-[#1F2720]">
                {project.title}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-[#1F2720]/60">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-[#ebe2d5] px-3 py-1 text-xs font-medium text-[#1F2720]/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
