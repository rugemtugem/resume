// app/resume/page.tsx
import { Navbar } from "@/components/layout/navbar";
import { HeroResume } from "@/components/sections/resume/hero-resume";
import { AboutResume } from "@/components/sections/resume/about-resume";
import { ExperienceResume } from "@/components/sections/resume/experience-resume";
import { SkillsResume } from "@/components/sections/resume/skills-resume";
import { ProjectsResume } from "@/components/sections/resume/projects-resume";
import { EducationResume } from "@/components/sections/resume/education-resume";
import { ContactResume } from "@/components/sections/resume/contact-resume";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "Fábio Soares - Currículo | Tech Lead Front-end",
  description: "Tech Lead com 8+ anos de experiência em desenvolvimento front-end, UX/UI e produtos digitais modernos.",
  openGraph: {
    title: "Fábio Soares | Tech Lead Front-end",
    description: "Tech Lead especializado em Next.js, React e UX/UI Design.",
    url: "https://rugemtugem.dev/resume",
    siteName: "Fábio Soares Portfolio",
    images: [
      {
        url: "/images/perfil.png",
        width: 1200,
        height: 630,
        alt: "Fábio Soares - Tech Lead",
      },
    ],
    locale: "pt_BR",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fábio Soares - Tech Lead Front-end",
    description: "Especialista em produtos digitais de alta performance.",
    images: ["/images/perfil.png"],
  },
};

export default function ResumePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroResume />
        <AboutResume />
        <ExperienceResume />
        <SkillsResume />
        <ProjectsResume />
        <EducationResume />
        <ContactResume />
      </main>
      <Footer />
    </>
  );
}
