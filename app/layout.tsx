import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rugemtugem.dev"),
  title: "Fábio Soares (Ferrugem) - Tech Lead & Especialista em IA | Portfolio",
  description:
    "Tech Lead em Front-end & Produtos Digitais | Especialista em Tecnologia & IA Aplicada. Experiência em React, Next.js, UX/UI Design e desenvolvimento de produtos digitais escaláveis.",
  keywords: [
    "Tech Lead",
    "Front-end Developer",
    "UX/UI Designer",
    "React",
    "Next.js",
    "TypeScript",
    "IA Aplicada",
    "Produtos Digitais",
  ],
  authors: [{ name: "Fábio Soares" }],
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
  openGraph: {
    title: "Fábio Soares (Ferrugem) - Tech Lead & Especialista em IA",
    description:
      "Tech Lead em Front-end & Produtos Digitais | Especialista em Tecnologia & IA Aplicada",
    url: "https://rugemtugem.dev",
    siteName: "Fábio Soares Portfolio",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/images/logo-nova.png",
        width: 1200,
        height: 630,
        alt: "Fábio Soares - Tech Lead & Especialista em IA",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            <ToastProvider>{children}</ToastProvider>
          </LanguageProvider>
        </ThemeProvider>

        {/* Console Easter Egg */}
        <Script
          src="/scripts/console-easter-egg.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
