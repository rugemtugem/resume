// app/resume/page.tsx
import { Navbar } from "@/components/layout/navbar";
import { HeroResume } from "@/components/sections/resume/hero-resume";
import { AboutResume } from "@/components/sections/resume/about-resume";
import { ExperienceResume } from "@/components/sections/resume/experience-resume";
import { SkillsResume } from "@/components/sections/resume/skills-resume";
import { ProjectsResume } from "@/components/sections/resume/projects-resume";
import { EducationResume } from "@/components/sections/resume/education-resume";
import { ContactResume } from "@/components/sections/resume/contact-resume";
import { AvailabilityBadge } from "@/components/resume/availability-badge";
import { WhyHireMeSection } from "@/components/sections/resume/why-hire-me";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "Currículo | Fábio Rugemtugem",
  description: "Currículo de Fábio Rugemtugem: 25+ anos de experiência em desenvolvimento web, UX/UI e produtos digitais.",
  alternates: { canonical: "/resume" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Currículo | Fábio Rugemtugem",
    description: "25+ anos de experiência em desenvolvimento web, UX/UI e produtos digitais.",
    url: "https://rugemtugem.dev/resume",
    siteName: "Rugemtugem",
    images: [{ url: "/images/perfil.png", alt: "Fábio Rugemtugem" }],
    locale: "pt_BR",
    type: "profile",
  },
};

export default function ResumePage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="pt-24 mb-6 flex justify-center">
          <AvailabilityBadge />
        </div>
        <HeroResume />
        <AboutResume />
        <WhyHireMeSection />
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
