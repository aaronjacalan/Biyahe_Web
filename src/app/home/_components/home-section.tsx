import { HERO } from "../../../data/portfolio";

export function HomeSection() {
  return (
    <section
      id="home"
      className="flex min-h-dvh flex-col items-center justify-center px-6 text-center"
    >
      <div className="animate-hero-slide">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#1F2720]/50">
          {HERO.subtitle}
        </p>
        <h1
          className="mb-4 text-5xl font-bold text-[#1F2720] md:text-7xl"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          {HERO.name}
        </h1>
        <p className="mx-auto mb-2 max-w-lg text-lg text-[#1F2720]/60">
          {HERO.tagline}
        </p>
        <p className="mx-auto max-w-md text-sm text-[#1F2720]/40">
          {HERO.techStack}
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <a
            href="#projects"
            className="rounded-2xl bg-[#1F2720] px-8 py-3 text-sm font-bold text-[#F6F0E3] transition-all hover:bg-[#2a3d2e]"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="rounded-2xl border border-[#1F2720]/20 px-8 py-3 text-sm font-bold text-[#1F2720] transition-all hover:bg-[#1F2720]/5"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  );
}
