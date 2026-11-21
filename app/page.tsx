// app/page.tsx
import { Navbar } from "@/components/layout/navbar";
import { HeroPartnership } from "@/components/sections/partnership/hero-partnership";
import { AboutPartnership } from "@/components/sections/partnership/about-partnership";
import { ExperiencePartnership } from "@/components/sections/partnership/experience-partnership";
import { SkillsPartnership } from "@/components/sections/partnership/skills-partnership";
import { ProjectsCases } from "@/components/sections/partnership/projects-cases";
import { EducationPartnership } from "@/components/sections/partnership/education-partnership";
import { HowItWorksSection } from "@/components/sections/partnership/how-it-works";
import { FAQSection } from "@/components/sections/partnership/faq-section";
import { ContactPartnership } from "@/components/sections/partnership/contact-partnership";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  alternates: { canonical: "/" },
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
        <HowItWorksSection />
        <EducationPartnership />
        <FAQSection />
        <ContactPartnership />
      </main>
      <Footer />
    </>
  );
}
