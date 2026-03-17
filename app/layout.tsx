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
const siteName = "Fábio Soares Portfolio";
const siteTitle = "Fábio Soares - Seu Parceiro Estratégico em Tecnologia";
const siteDescription = "Transformo desafios técnicos em resultados de negócio escaláveis. Descubra como ajudei mais de 50 empresas a gerar R$ 5M+ em valor real.";
const ogImageLandscape = "https://rugemtugem.dev/images/og_image_1.png";
const ogImageSquare = "https://rugemtugem.dev/images/logo-nova.png";

export const metadata: Metadata = {
  /* ---- Core ---- */
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  keywords: [
    "Parceiro Estratégico",
    "Especialista em Tecnologia",
    "Tech Lead",
    "React",
    "Next.js",
    "TypeScript",
    "Fábio Soares",
    "Ferrugem",
  ],
  authors: [{ name: "Fábio Soares", url: siteUrl }],
  creator: "Fábio Soares",
  publisher: "Fábio Soares",
  category: "technology",

  /* ---- Icons ---- */
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/favicon.png",
  },

  /* ---- Open Graph (Facebook & LinkedIn) ---- */
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName,
    locale: "pt_BR",
    alternateLocale: "en_US",
    type: "website",
    images: [
      {
        url: ogImageLandscape,
        width: 1200,
        height: 630,
        alt: siteTitle,
        type: "image/png",
      },
      {
        url: ogImageSquare,
        width: 1080,
        height: 1080,
        alt: siteTitle,
        type: "image/png",
      },
    ],
  },

  /* ---- Twitter / X Card ---- */
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImageLandscape],
    creator: "@rugemtugem",
  },

  /* ---- Robots ---- */
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

  /* ---- Alternates ---- */
  alternates: {
    canonical: siteUrl,
  },
};

/* ------------------------------------------------------------------ */
/*  JSON-LD — Structured Data (Google Rich Results)                   */
/* ------------------------------------------------------------------ */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Fábio Soares",
  alternateName: "Ferrugem",
  url: siteUrl,
  image: `${siteUrl}/images/perfil.png`,
  jobTitle: "Especialista em Tecnologia & IA, Desenvolvedor Front-end",
  description: siteDescription,
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "UX/UI Design",
    "Inteligência Artificial",
    "Front-end Development",
    "Produtos Digitais",
  ],
  sameAs: [
    "https://github.com/rugemtugem",
    "https://linkedin.com/in/rugemtugem",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  worksFor: {
    "@type": "Organization",
    name: "Sales Prime",
  },
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
