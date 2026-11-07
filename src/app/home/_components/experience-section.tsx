import { EDUCATION } from "../../../data/portfolio";

export function ExperienceSection() {
  return (
    <section
      id="education"
      className="flex min-h-dvh flex-col justify-center px-8 md:px-20"
    >
      <h2
        className="mb-10 text-3xl font-bold text-[#1F2720] md:text-4xl"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        EDUCATION
      </h2>
      <div className="relative space-y-0">
        {EDUCATION.map((item) => (
          <div key={item.period} className="group relative pl-10 pb-10 last:pb-0">
            <div className="absolute left-[11px] top-2 h-full w-px bg-[#d8cfbf] last:hidden" />
            <div className="absolute left-0 top-2 h-6 w-6 rounded-full border-2 border-[#d8cfbf] bg-[#F6F0E3] transition-colors group-hover:border-[#1F2720]" />
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-[#1F2720]/40">
                {item.period}
              </span>
              <h3 className="mt-1 text-lg font-bold text-[#1F2720]">
                {item.degree}
              </h3>
              <p className="text-sm font-medium text-[#1F2720]/50">
                {item.institution}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#1F2720]/60">
                {item.subText}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
