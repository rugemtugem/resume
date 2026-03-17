import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { RoiCalculator } from "@/components/roi-calculator/roi-calculator";

export const metadata = {
  title: "Calculadora de ROI para Automação | Fábio Soares",
  description: "Calcule em 2 minutos o custo REAL do retrabalho e descubra quanto você está perdendo com processos manuais.",
  openGraph: {
    title: "Calculadora de ROI para Automação",
    description: "Descubra quanto dinheiro sua operação perde com processos manuais e o potencial de economia com automações inteligêntes.",
    url: "https://rugemtugem.dev/calculadora-roi",
    siteName: "Fábio Soares Portfolio",
    images: [
      {
        url: "https://rugemtugem.dev/images/og_image_1.png",
        width: 1200,
        height: 630,
        alt: "Calculadora de ROI - Fábio Soares",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RoiCalculatorPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Quanto Você Está <span className="text-red-500">Perdendo</span> com Processos Manuais?
            </h1>
            <p className="text-xl text-[var(--text-secondary)]">
              Calcule em 2 minutos o custo REAL do retrabalho na sua empresa.
            </p>
          </div>

          {/* Social Proof & Context */}
          <div className="flex flex-col md:flex-row justify-center gap-6 mb-12 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Baseado em <strong>50+ projetos reais</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Média de <strong>R$ 12k/mês em desperdício</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Relatório PDF <strong>personalizado grátis</strong></span>
            </div>
          </div>

          {/* The Interactive Calculator Component */}
          <RoiCalculator />

        </div>
      </main>
      <Footer />
    </>
  );
}
