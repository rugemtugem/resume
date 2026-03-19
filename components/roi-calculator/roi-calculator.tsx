"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, ArrowRight, Download, Mail, PieChart, TrendingUp, DollarSign, Clock, Loader2 } from "lucide-react";
import { PrimaryButton } from "@/components/ui/buttons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { PdfReportLayout } from "./pdf-report-layout";

export function RoiCalculator() {
  // Passos: 1 = Calculadora, 2 = Captura de Lead, 3 = Resultado
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Inputs
  const [revenue, setRevenue] = useState(150000);
  const [hours, setHours] = useState(20);
  const [hourlyCost, setHourlyCost] = useState(50);
  
  // Lead Info
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Formatting utilities
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Cálculos Core
  // Custo da ineficiência atual
  const monthlyLostCost = hours * 4 * hourlyCost;
  // Custo de oportunidade (receita perdida pelo tempo não investido em vendas/crescimento)
  const opportunityCost = (revenue * 0.05); // Assumindo 5% de gargalo
  const totalMonthlyLoss = monthlyLostCost + opportunityCost;

  // Impacto da automação (Assumindo 80% de redução de tempo)
  const savingsMonthly = totalMonthlyLoss * 0.8;
  const annualSavings = savingsMonthly * 12;
  const averageAutomationCost = 15000; // Investimento médio estimado conservador
  const roi = ((annualSavings - averageAutomationCost) / averageAutomationCost) * 100;
  const paybackMonths = averageAutomationCost / savingsMonthly;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    
    setIsSubmitting(true);
    // Simular envio de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setStep(3);
    
    // Automatically trigger PDF generation to run in background and send via Email
    // We will do this slightly after render using setTimeout
    setTimeout(() => {
       generatePDF(true); // pass true for background email send
    }, 500);
  };

  const generatePDF = async (sendEmail = false) => {
    const pages = document.querySelectorAll(".pdf-a4-page");
    if (!pages || pages.length === 0) return;

    if (!sendEmail) setIsGeneratingPdf(true);
    
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [794, 1123], // A4 dimensions in pixels at 96 DPI (approx 210x297mm)
      });

      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i] as HTMLElement, {
          scale: 2, // Higher scale for better resolution
          useCORS: true,
          backgroundColor: '#ffffff', // Ensure white background for PDF
        });
        const imgData = canvas.toDataURL("image/jpeg", 0.95); // Use JPEG for smaller file size
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, 794, 1123);
        
        // Add clickable link area over the "Agendar Reunião" button on the last page (Index 5)
        if (i === 5) {
          pdf.link(150, 350, 494, 200, { url: 'https://calendly.com/rugemtugem/diagnostico' });
        }
      }

      if (sendEmail) {
        // Enviar por email no background
        const pdfBase64 = pdf.output("datauristring");
        await fetch("/api/send-roi-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: name.split(" ")[0],
            email,
            empresa: empresa || "sua operação",
            pdfBase64,
            custoMensal: formatCurrency(totalMonthlyLoss),
            economia70: formatCurrency(savingsMonthly),
            roi12meses: roi.toFixed(0)
          })
        });
      } else {
        // Download for user
        pdf.save(`Analise-ROI-${empresa ? empresa.trim().replace(/\s+/g, '-') : 'estrategica'}.pdf`);
      }
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      if (!sendEmail) setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
      
      {/* Background glow for depth */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--primary-color)] opacity-5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[var(--color-accent-blue)] opacity-5 rounded-full blur-[100px] pointer-events-none" />

      {/* Step 1: Sliders and Inputs */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-8 border-b border-[var(--border-color)] pb-6">
            <div className="w-12 h-12 rounded-xl bg-[var(--primary-color)]/10 flex items-center justify-center text-[var(--primary-color)]">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Simulador de Custos</h2>
              <p className="text-[var(--text-secondary)] text-sm">Ajuste os valores de acordo com a sua realidade atual.</p>
            </div>
          </div>

          <form onSubmit={handleCalculate} className="space-y-10">
            {/* Control 1 */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[var(--text-secondary)]" /> Faturamento Mensal Médio
                </label>
                <span className="text-xl font-bold text-[var(--primary-color)]">{formatCurrency(revenue)}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="1000000"
                step="10000"
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[var(--primary-color)]"
              />
              <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                <span>R$ 10k</span>
                <span>R$ 1M+</span>
              </div>
            </div>

            {/* Control 2 */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--text-secondary)]" /> Horas perdidas na semana (Processos manuais)
                </label>
                <span className="text-xl font-bold text-red-500">{hours} hs</span>
              </div>
              <input
                type="range"
                min="2"
                max="80"
                step="1"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                <span>2h/sem</span>
                <span>80h/sem</span>
              </div>
            </div>

            {/* Control 3 */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[var(--text-secondary)]" /> Custo médio da hora da sua equipe
                </label>
                <span className="text-xl font-bold text-orange-400">{formatCurrency(hourlyCost)}/h</span>
              </div>
              <input
                type="range"
                min="15"
                max="250"
                step="5"
                value={hourlyCost}
                onChange={(e) => setHourlyCost(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-400"
              />
              <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                <span>R$ 15/h</span>
                <span>R$ 250/h</span>
              </div>
            </div>

            {/* Live Preview Teaser */}
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">Custo invisível estimado:</span>
              <span className="text-lg font-bold text-red-500 flex items-center blur-[6px] select-none pointer-events-none">
                {formatCurrency(totalMonthlyLoss)}
              </span>
            </div>

            <div className="pt-4">
              <PrimaryButton type="submit" className="w-full justify-center text-lg h-14" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Ver Meu Diagnóstico Completo
              </PrimaryButton>
            </div>
          </form>
        </motion.div>
      )}

      {/* Step 2: Gated Lead Capture */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center py-8"
        >
          <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-6">
            <PieChart className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Seu relatório está pronto!</h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
            Identificamos um vazamento financeiro crítico na sua operação. Para onde enviamos seu diagnóstico detalhado e o plano de automação?
          </p>

          <form onSubmit={handleSubmitLead} className="max-w-md mx-auto space-y-4">
            <input
              type="text"
              placeholder="Seu nome"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-[var(--primary-color)] outline-none transition-colors"
            />
            <input
              type="text"
              placeholder="Nome da sua Empresa"
              required
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-[var(--primary-color)] outline-none transition-colors"
            />
            <input
              type="email"
              placeholder="Seu melhor e-mail corporativo (para envio)"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-[var(--primary-color)] outline-none transition-colors"
            />
            
            <PrimaryButton 
              type="submit" 
              className="w-full justify-center h-14 mt-4" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Gerando Relatório..." : "Revelar Meus Números"}
            </PrimaryButton>
            
            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="mt-6 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline underline-offset-4"
            >
              Voltar e ajustar valores
            </button>
          </form>
        </motion.div>
      )}

      {/* Step 3: Result Reveal */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
          id="roi-result-container"
          style={{ padding: '20px' }} // Add some padding for the PDF capture
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Diagnóstico de Gargalos</h2>
            <p className="text-[var(--text-secondary)]">Baseado nos dados da {name.split(" ")[0]} operation.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* The Loss */}
            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
              <p className="text-sm font-semibold text-red-500 uppercase tracking-widest mb-2">Dinheiro na Mesa</p>
              <h3 className="text-4xl font-bold text-red-500 mb-2">{formatCurrency(totalMonthlyLoss)}</h3>
              <p className="text-sm text-[var(--text-secondary)]">Desperdício mensal estimado com tarefas rotineiras e custo de oportunidade.</p>
            </div>

            {/* The Solution */}
            <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-center">
              <p className="text-sm font-semibold text-green-500 uppercase tracking-widest mb-2">Potencial de Economia</p>
              <h3 className="text-4xl font-bold text-green-500 mb-2">{formatCurrency(savingsMonthly)}</h3>
              <p className="text-sm text-[var(--text-secondary)]">Economia mensal automatizando 80% das atividades manuais analisadas.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-center">
              <p className="text-xs text-[var(--text-secondary)] uppercase mb-1">Payback Estimado</p>
              <p className="text-xl font-bold text-[var(--primary-color)]">
                {paybackMonths < 1 ? "< 1 Mês" : `${Math.ceil(paybackMonths)} Meses`}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-center">
              <p className="text-xs text-[var(--text-secondary)] uppercase mb-1">ROI Projeção (12m)</p>
              <p className="text-xl font-bold text-green-400">
                +{roi.toFixed(0)}%
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center p-6 bg-gradient-to-r from-[var(--primary-color)]/10 to-[var(--color-accent-blue)]/10 rounded-2xl border border-[var(--primary-color)]/20">
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-1">Pare de Perder Esse Dinheiro</h4>
              <p className="text-sm text-[var(--text-secondary)]">Enviamos um PDF detalhado para o seu e-mail. Vamos agendar uma conversa para mapear quais dessas horas podemos automatizar hoje?</p>
            </div>
            <div className="w-full sm:w-auto mt-4 sm:mt-0">
              <a 
                href="https://wa.me/5511986514401?text=Oi%20Fábio!%20Acabei%20de%20usar%20a%20Calculadora%20de%20ROI%20e%20vi%20que%20estou%20perdendo%20muitas%20horas.%20Quero%20entender%20como%20automatizar." 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold transition-all w-full"
              >
                Chamar no WhatsApp
              </a>
            </div>
          </div>
          
          <div className="text-center mt-6" data-html2canvas-ignore>
            <button 
              onClick={() => generatePDF(false)}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Gerando PDF...</>
              ) : (
                <><Download className="w-4 h-4" /> Baixar PDF do Relatório</>
              )}
            </button>
          </div>

        </motion.div>
      )}

      {/* Hidden PDF Report Template (Rendered off-screen for html2canvas to slice cleanly into 6 pages) */}
      {step === 3 && (
        <PdfReportLayout 
          name={name}
          empresa={empresa}
          revenue={revenue}
          hours={hours}
          hourlyCost={hourlyCost}
          totalMonthlyLoss={totalMonthlyLoss}
          savingsMonthly={savingsMonthly}
          roi={roi}
          averageAutomationCost={averageAutomationCost}
          annualSavings={annualSavings}
          paybackMonths={paybackMonths}
          monthlyLostCost={monthlyLostCost}
          opportunityCost={opportunityCost}
        />
      )}

    </div>
  );
}
