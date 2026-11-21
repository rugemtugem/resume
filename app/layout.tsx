import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/language-provider";
import { PageModeProvider } from "@/contexts/page-mode-provider";
import { ToastProvider } from "@/components/ui/toast";
import { RoiPopup } from "@/components/roi-calculator/roi-popup";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

/* ------------------------------------------------------------------ */
/*  SEO — Meta Tags: Google, Facebook (Open Graph), Twitter, LinkedIn */
/* ------------------------------------------------------------------ */

const siteUrl = "https://rugemtugem.dev";
const siteName = "Rugemtugem";
const siteTitle = "Integração de sistemas e soluções em IA | Rugemtugem";
const siteDescription = "A Rugemtugem conecta site, WhatsApp e sistemas da sua empresa e cria soluções em IA para o trabalho manual sumir. Diagnóstico gratuito com Fábio Rugemtugem.";
const ogImage = "https://rugemtugem.dev/images/og_image_1.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  keywords: [
    "Rugemtugem",
    "Fábio Rugemtugem",
    "integração de sistemas",
    "automação para empresas",
    "soluções em IA",
    "WordPress sob medida",
  ],
  authors: [{ name: "Fábio Rugemtugem", url: siteUrl }],
  creator: "Fábio Rugemtugem",
  publisher: "Rugemtugem",
  category: "technology",

  icons: {
    icon: "/images/favicon.png",
    apple: "/images/favicon.png",
  },

  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName,
    locale: "pt_BR",
    type: "website",
    images: [{ url: ogImage, width: 1536, height: 1024, alt: siteTitle, type: "image/png" }],
  },

  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
    creator: "@rugemtugem",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // O canonical é definido em cada página. Aqui ele vazaria para todas.
};

/* ------------------------------------------------------------------ */
/*  JSON-LD: pessoa, empresa e site                                    */
/* ------------------------------------------------------------------ */

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#fabio`,
      name: "Fábio Rugemtugem",
      alternateName: "Fábio Soares",
      url: siteUrl,
      image: `${siteUrl}/images/perfil.png`,
      jobTitle: "Especialista em Tecnologia & IA, Desenvolvedor Front-end",
      knowsAbout: [
        "Integração de sistemas",
        "Automação de processos",
        "WordPress",
        "Inteligência Artificial aplicada",
        "UX/UI Design",
        "Next.js",
      ],
      sameAs: [
        "https://github.com/rugemtugem",
        "https://linkedin.com/in/rugemtugem",
        "https://instagram.com/rugemtugem/",
      ],
      worksFor: { "@id": `${siteUrl}/#rugemtugem` },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#rugemtugem`,
      name: "Rugemtugem",
      url: siteUrl,
      image: ogImage,
      description: siteDescription,
      foundingDate: "2000-11",
      founder: { "@id": `${siteUrl}/#fabio` },
      email: "contato@rugemtugem.dev",
      telephone: "+55 11 98651-4401",
      areaServed: "BR",
      address: {
        "@type": "PostalAddress",
        addressLocality: "São Paulo",
        addressRegion: "SP",
        addressCountry: "BR",
      },
      sameAs: ["https://instagram.com/rugemtugem/"],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#site`,
      url: siteUrl,
      name: "Rugemtugem",
      inLanguage: "pt-BR",
      publisher: { "@id": `${siteUrl}/#rugemtugem` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>

      {/* Google Analytics (gtag.js) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-M2K9HY4EXN"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-M2K9HY4EXN');
        `}
      </Script>
      <body className={`${inter.variable} antialiased overflow-x-hidden`}>
        <ThemeProvider>
          <PageModeProvider>
            <LanguageProvider>
              <ToastProvider>{children}</ToastProvider>
            </LanguageProvider>
          </PageModeProvider>
        </ThemeProvider>

        {/* Console Easter Egg */}
        <Script
          src="/scripts/console-easter-egg.js"
          strategy="afterInteractive"
        />

        {/* Global Lead Capture Popup */}
        <RoiPopup />
      </body>
    </html>
  );
}
