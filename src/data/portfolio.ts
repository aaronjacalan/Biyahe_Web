import type {
  Project,
  TechItem,
  EducationItem,
  HeroData,
  AboutData,
  ContactLink,
} from "../types";

export const PROJECTS: Project[] = [
  {
    id: "PRJ_NI_01",
    icon: "visibility",
    title: "BIYAHE",
    description: "A Jeepney Route Guide App built with Android Studio.",
    tags: ["KOTLIN", "FIREBASE", "ANDROID STUDIO"],
    imageUrl: "",
    imageAlt: "Neural Interface Concept",
  },
  {
    id: "PRJ_PZ_02",
    icon: "terminal",
    title: "BALIKAW",
    description: "A 3D horror game inspired by Filipino folklore, superstitions, and traditional beliefs, blending cultural myths with immersive survival gameplay.",
    tags: ["GODOT", "3D GAME", "HORROR", "FIRST-PERSON"],
    imageUrl: "balikaw.png",
    imageAlt: "Image of Balikaw Game Cover",
  },
  {
    id: "PRJ_GX_03",
    icon: "grid_view",
    title: "CHROMA",
    description: "A 2D top-down dungeon game made for Global Game Jam 2026, built in 48 hours, where players switch color masks to defeat enemies vulnerable only to matching hues.",
    tags: ["GODOT", "2D GAME", "PLATFORMER"],
    imageUrl: "chroma.png",
    imageAlt: "Image of Chroma Game",
  },
  {
    id: "PRJ_SY_04",
    icon: "memory",
    title: "PLUNDERING TIME",
    description: "A 2D roguelike pirate ship survival game inspired by Vampire Survivors. Sail cursed seas, battle ever-changing waves of enemies and sea bosses, and upgrade your vessel to survive unpredictable voyages and claim legendary treasures.",
    tags: ["GODOT", "2D GAME", "ROGUELIKE"],
    imageUrl: "plunderingtime.png",
    imageAlt: "Image of Plundering Time",
  },
];

export const TECH_STACK: TechItem[] = [
  { icon: "javascript", label: "TYPESCRIPT" },
  { icon: "code",       label: "REACT"      },
  { icon: "code",       label: "C#"         },
  { icon: "code",       label: "C"          },
  { icon: "code",       label: "JAVA"       },
  { icon: "code",       label: "PYTHON"     },
  { icon: "code",       label: "C"          },
  { icon: "code",       label: "JAVA"       },
  { icon: "code",       label: "PYTHON"     },
  { icon: "code",       label: "GODOT"      },
  { icon: "code",       label: "LINUX"      },
];

export const HERO: HeroData = {
  subtitle: "Welcome to my portfolio",
  name: "Aaron Jacalan",
  tagline: "Front-end Developer crafting modern, interactive web experiences",
  techStack: "React \u2022 TypeScript \u2022 Godot \u2022 C# \u2022 C++ \u2022 Linux",
};

export const ABOUT: AboutData = {
  title: "About Me",
  paragraphs: [
    "I'm a front-end developer with a passion for creating modern, interactive web experiences using React and Next.js. Alongside web development, I'm deeply interested in game development, with a growing focus on environment design and seamlessly integrating characters into immersive worlds. I'm also expanding my backend knowledge to build more complete, full-stack applications.",
    "I believe great software and games come from thoughtful design, clean code, and engaging user experiences. When I'm not building web applications, you'll find me experimenting with game mechanics, creating environments, learning new technologies, or exploring better workflows to improve my development skills.",
  ],
};

export const CONTACT_LINKS: ContactLink[] = [
  { href: "mailto:aaaaron.jacalan@gmail.com", label: "aaaaron.jacalan@gmail.com", type: "email" },
  { href: "https://github.com/aaronjacalan", label: "github.com/aaronjacalan", type: "github" },
  { href: "https://linkedin.com/in/aaron-jacalan/", label: "linkedin.com/in/aaron-jacalan", type: "linkedin" },
];

export const EDUCATION: EducationItem[] = [
  {
    period: "AUG 2023 - PRESENT",
    degree: "Bachelor of Science in Computer Science",
    institution: "Cebu Institute of Technology - University",
    subText:
      "Relevant Coursework: Web and Application Development, Software Engineering, Data Structures & Algorithms, Operating Systems, Machine Learning Fundamentals, Database Design.",
    active: true,
  },
];
