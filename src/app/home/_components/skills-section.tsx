import { Code, FileJson, Layers } from "lucide-react";
import { TECH_STACK } from "../../../data/portfolio";

const iconMap: Record<string, typeof Code> = {
  code: Code,
  javascript: FileJson,
};

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="flex min-h-dvh flex-col justify-center px-8 md:px-20"
    >
      <h2
        className="mb-10 text-3xl font-bold text-[#1F2720] md:text-4xl"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        SKILLS
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {TECH_STACK.map((item, index) => {
          const Icon = iconMap[item.icon] ?? Layers;
          return (
            <div
              key={`${item.label}-${index}`}
              className="flex items-center gap-3 rounded-2xl border border-[#d8cfbf] bg-white/50 px-5 py-4 transition-shadow hover:shadow-md"
            >
              <Icon className="h-5 w-5 text-[#1F2720]/40" strokeWidth={1.5} />
              <span className="text-sm font-bold text-[#1F2720]/80">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
