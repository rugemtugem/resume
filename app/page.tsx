// app/page.tsx
import { Navbar } from "@/components/layout/navbar";
import { HeroPartnership } from "@/components/sections/partnership/hero-partnership";
import { AboutPartnership } from "@/components/sections/partnership/about-partnership";
import { ExperiencePartnership } from "@/components/sections/partnership/experience-partnership";
import { SkillsPartnership } from "@/components/sections/partnership/skills-partnership";
import { ProjectsCases } from "@/components/sections/partnership/projects-cases";
import { EducationPartnership } from "@/components/sections/partnership/education-partnership";
import { ContactPartnership } from "@/components/sections/partnership/contact-partnership";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "Fábio Soares - Parceiro Estratégico em Tecnologia",
  description: "Transformo desafios técnicos em resultados de negócio. R$ 5M+ em valor gerado para parceiros através de produtos digitais que escalam.",
  openGraph: {
    title: "Fábio Soares - Parceiro Estratégico em Tecnologia",
    description: "Transformo desafios técnicos em resultados de negócio. R$ 5M+ em valor gerado para parceiros.",
    url: "https://rugemtugem.dev",
    siteName: "Fábio Soares Portfolio",
    images: [
      {
        url: "/images/logo-nova.png",
        width: 1200,
        height: 630,
        alt: "Fábio Soares - Strategic Technology Partner",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fábio Soares - Parceiro Estratégico em Tecnologia",
    description: "Resultados mensuráveis através de tecnologia e IA.",
    images: ["/images/logo-nova.png"],
  },
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroPartnership />
        <AboutPartnership />
        <ExperiencePartnership />
        <SkillsPartnership />
        <ProjectsCases />
        <EducationPartnership />
        <ContactPartnership />
      </main>
      <Footer />
    </>
  );
}
