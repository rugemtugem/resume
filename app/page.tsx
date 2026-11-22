// app/page.tsx
import { Navbar } from "@/components/layout/navbar";
import { HeroPartnership } from "@/components/sections/partnership/hero-partnership";
import { Avaliacoes } from "@/components/sections/partnership/avaliacoes";
import { ServicosHome } from "@/components/sections/partnership/servicos-home";
import { ProjectsCases } from "@/components/sections/partnership/projects-cases";
import { HowItWorksSection } from "@/components/sections/partnership/how-it-works";
import { BlogHome } from "@/components/sections/partnership/blog-home";
import { AboutPartnership } from "@/components/sections/partnership/about-partnership";
import { FAQSection } from "@/components/sections/partnership/faq-section";
import { ContactPartnership } from "@/components/sections/partnership/contact-partnership";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  alternates: { canonical: "/" },
};

// A seção do blog lê os posts publicados: a home se atualiza sozinha quando um post vence o horário.
export const revalidate = 300;

/** Home para clientes. Experiência, habilidades e educação ficam só no /resume. */
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroPartnership />
        <Avaliacoes />
        <ServicosHome />
        <ProjectsCases />
        <HowItWorksSection />
        <BlogHome />
        <AboutPartnership />
        <FAQSection />
        <ContactPartnership />
      </main>
      <Footer />
    </>
  );
}
