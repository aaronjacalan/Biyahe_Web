import { ABOUT } from "../../../data/portfolio";

export function AboutSection() {
  return (
    <section
      id="about"
      className="flex min-h-dvh flex-col justify-center px-8 md:px-20"
    >
      <h2
        className="mb-10 text-3xl font-bold text-[#1F2720] md:text-4xl"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        {ABOUT.title}
      </h2>
      <div className="max-w-3xl space-y-5 text-base leading-relaxed text-[#1F2720]/70">
        {ABOUT.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}
