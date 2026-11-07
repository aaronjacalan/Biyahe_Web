export interface Project {
  id: string;
  icon: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  imageAlt: string;
}

export interface TechItem {
  icon: string;
  label: string;
}

export interface EducationItem {
  period: string;
  degree: string;
  institution: string;
  subText: string;
  active: boolean;
}

export interface HeroData {
  subtitle: string;
  name: string;
  tagline: string;
  techStack: string;
}

export interface AboutData {
  title: string;
  paragraphs: string[];
}

export interface ContactLink {
  href: string;
  label: string;
  type: "email" | "github" | "linkedin";
}
