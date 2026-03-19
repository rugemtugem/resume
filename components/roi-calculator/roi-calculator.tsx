"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, ArrowRight, Download, Mail, PieChart, TrendingUp, DollarSign, Clock, Loader2 } from "lucide-react";
import { PrimaryButton } from "@/components/ui/buttons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
        <div 
          id="pdf-report-container" 
          className="fixed top-[200vh] left-[-9999px] w-[794px] z-[-1]"
        >
          {/**************** PAGE 1: CAPA ****************/}
          <div className="pdf-a4-page w-[794px] h-[1123px] bg-gradient-to-br from-[#1E293B] to-[#0F172A] relative flex flex-col justify-center items-center text-center p-[60px] overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-500/20 rounded-full blur-[100px]" />
            
            <h1 className="text-white text-5xl font-black mb-8 leading-tight tracking-tight relative z-10">
              ANÁLISE DE ROI <br/><span className="text-blue-400">PERSONALIZADA</span>
            </h1>
            <p className="text-xl text-gray-300 font-medium mb-2 relative z-10">Preparado exclusivamente para:</p>
            <p className="text-4xl text-white font-black mb-12 relative z-10">{empresa || name}</p>
            
            <div className="w-full max-w-[600px] bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20 mb-16 relative z-10">
              <div className="mb-6">
                <p className="text-gray-300 text-lg mb-2">💸 Você está perdendo:</p>
                <p className="text-red-400 text-4xl font-black">{formatCurrency(totalMonthlyLoss)} <span className="text-xl">/ mês</span></p>
              </div>
              <div className="mb-6">
                <p className="text-gray-300 text-lg mb-2">✅ Potencial de economia:</p>
                <p className="text-green-400 text-4xl font-black">{formatCurrency(savingsMonthly)} <span className="text-xl">/ mês</span></p>
              </div>
              <div>
                <p className="text-gray-300 text-lg mb-2">📈 ROI Estimado (12 meses):</p>
                <p className="text-blue-400 text-4xl font-black">+{roi.toFixed(0)}%</p>
              </div>
            </div>
            
            <div className="mt-auto relative z-10">
              <p className="text-white font-bold text-xl mb-1">Fábio Soares</p>
              <p className="text-blue-300 text-sm tracking-widest uppercase">Tech Lead & Partner | rugemtugem.dev</p>
            </div>
          </div>

          {/**************** PAGE 2: DIAGNÓSTICO ****************/}
          <div className="pdf-a4-page w-[794px] h-[1123px] bg-white p-[60px] flex flex-col relative text-gray-900 border-b border-gray-100">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-8 border-b-4 border-blue-500 pb-4 inline-block">1. O Retrato Atual</h2>
            
            <h3 className="text-xl font-bold text-gray-800 mb-4">Dados Informados na Operação:</h3>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-10">
              <div className="flex justify-between border-b border-gray-200 py-3"><span className="font-semibold text-gray-600">Receita Mensal</span><span className="font-bold text-gray-900">{formatCurrency(revenue)}</span></div>
              <div className="flex justify-between border-b border-gray-200 py-3"><span className="font-semibold text-gray-600">Horas em Processos Manuais</span><span className="font-bold text-gray-900">{hours} horas/semana</span></div>
              <div className="flex justify-between py-3"><span className="font-semibold text-gray-600">Custo da Equipe</span><span className="font-bold text-gray-900">{formatCurrency(hourlyCost)}/hora</span></div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-4">O Custo Silencioso do Retrabalho:</h3>
            <div className="bg-red-50 rounded-2xl p-8 border border-red-100 mb-10">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-gray-700">Gargalo Semanal Direto:</span>
                <span className="text-2xl font-bold text-red-600">{formatCurrency(monthlyLostCost / 4)}</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-gray-700">Custo de Oportunidade Mensal:</span>
                <span className="text-2xl font-bold text-red-600">{formatCurrency(opportunityCost)}</span>
              </div>
              <div className="border-t border-red-200 my-6"></div>
              <div className="flex justify-between items-center">
                <span className="text-xl font-black text-gray-900">Perda Total por Mês:</span>
                <span className="text-4xl font-black text-red-600">{formatCurrency(totalMonthlyLoss)}</span>
              </div>
              <div className="mt-4 text-sm font-semibold text-red-500 text-right uppercase tracking-wider">
                Isso representa {((totalMonthlyLoss / revenue) * 100).toFixed(1)}% do seu faturamento sendo queimado.
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-4">Mapeamento Típico de Gargalos para o seu Setor:</h3>
            <p className="text-gray-600 mb-6 text-lg">Geralmente, {hours} horas perdidas por semana se acumulam nos seguintes processos vitais:</p>
            <ul className="space-y-4">
              <li className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">1</div>
                <div><p className="font-bold text-gray-900">Gestão de Pedidos e NF-e</p><p className="text-sm text-gray-500">Alto Risco de Erro Humano | Esforço Diário</p></div>
              </li>
              <li className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">2</div>
                <div><p className="font-bold text-gray-900">Relatórios Gerenciais Manuais</p><p className="text-sm text-gray-500">Decisões com dados defasados | Esforço Semanal</p></div>
              </li>
              <li className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">3</div>
                <div><p className="font-bold text-gray-900">Follow-up e Atendimento</p><p className="text-sm text-gray-500">Lentidão na resposta a leads quente | Alto Impacto de Vendas</p></div>
              </li>
            </ul>
          </div>

          {/**************** PAGE 3: SOLUÇÕES ****************/}
          <div className="pdf-a4-page w-[794px] h-[1123px] bg-white p-[60px] flex flex-col relative text-gray-900 border-b border-gray-100">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-8 border-b-4 border-green-500 pb-4 inline-block">2. Plano de Ação Personalizado</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Substituindo esforço manual por automações escaláveis, nossa meta principal é reduzir 80% dessas horas perdidas, convertendo-as em vendas e alívio de margem.
            </p>

            <div className="bg-white border-l-4 border-blue-600 shadow-md rounded-r-2xl p-8 mb-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-blue-700">🥇 Prioridade 1: Automação Core End-to-End</h3>
                <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">Meses 1-2</span>
              </div>
              <p className="text-gray-600 mb-6">Integração fluida entre ERP, Meio de Pagamento e Plataforma de Vendas limitando interações humanas a apenas aprovações e exceções críticas.</p>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                <div><p className="text-xs text-gray-500 uppercase font-bold mb-1">Tempo Recuperado</p><p className="text-lg font-bold text-gray-900">Até 60% das horas</p></div>
                <div><p className="text-xs text-gray-500 uppercase font-bold mb-1">Impacto Imediato</p><p className="text-lg font-bold text-green-600">Zero Erros Fiscais</p></div>
              </div>
            </div>

            <div className="bg-white border-l-4 border-purple-600 shadow-md rounded-r-2xl p-8 mb-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-purple-700">🥈 Prioridade 2: Conversão Autônoma Integrada</h3>
                <span className="bg-purple-100 text-purple-800 text-sm font-bold px-3 py-1 rounded-full">Meses 2-3</span>
              </div>
              <p className="text-gray-600 mb-6">Conexão de RD Station/HubSpot com WhatsApp API (Suri, Z-API) para nutrição de leads, disparos automáticos de fatura e onboarding humanizado.</p>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                <div><p className="text-xs text-gray-500 uppercase font-bold mb-1">Aumento de Receita</p><p className="text-lg font-bold text-gray-900">+15% a 30% Convertidos</p></div>
                <div><p className="text-xs text-gray-500 uppercase font-bold mb-1">Tempo de Resposta</p><p className="text-lg font-bold text-green-600">&lt; 3 Segundos</p></div>
              </div>
            </div>

            <div className="bg-white border-l-4 border-orange-500 shadow-md rounded-r-2xl p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-orange-600">💡 Quick Win Imediato: Dashboard C-Level</h3>
                <span className="bg-orange-100 text-orange-800 text-sm font-bold px-3 py-1 rounded-full">Semana 1-2</span>
              </div>
              <p className="text-gray-600 mb-6">Consolidação dos dados espalhados em uma única visão (PowerBI ou Painel Customizado React). Decisões assertivas em tempo real no lugar de planilhas de final de mês.</p>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                <div><p className="text-xs text-gray-500 uppercase font-bold mb-1">Setup Previsto</p><p className="text-lg font-bold text-gray-900">Expresso</p></div>
                <div><p className="text-xs text-gray-500 uppercase font-bold mb-1">Visão</p><p className="text-lg font-bold text-green-600">Lucro Real Diário</p></div>
              </div>
            </div>
          </div>

          {/**************** PAGE 4: ROADMAP E ROI ****************/}
          <div className="pdf-a4-page w-[794px] h-[1123px] bg-white p-[60px] flex flex-col relative text-gray-900 border-b border-gray-100">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-8 border-b-4 border-yellow-500 pb-4 inline-block">3. Projeção de Retorno (ROI)</h2>

            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Baseado na implementação dos motores de automação mapeados, este é o cenário conservador de rentabilidade sobre a modernização tecnológica para faturamentos de <b>{formatCurrency(revenue)}</b>.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="p-8 border border-gray-200 rounded-3xl bg-gray-50 text-center">
                <p className="text-sm text-gray-500 uppercase font-bold tracking-widest mb-3">Orçamento Estimado Setup</p>
                <div className="flex items-center justify-center h-16">
                  <p className="text-4xl font-black text-gray-900">{formatCurrency(averageAutomationCost)}</p>
                </div>
                <p className="text-xs text-gray-400 mt-4">*Média típica para integração full-stack</p>
              </div>
              
              <div className="p-8 border border-green-200 rounded-3xl bg-green-50 text-center shadow-sm">
                <p className="text-sm text-green-600 uppercase font-bold tracking-widest mb-3">Economia Gerada (12 Meses)</p>
                <div className="flex items-center justify-center h-16">
                  <p className="text-4xl font-black text-green-600">{formatCurrency(annualSavings)}</p>
                </div>
                <p className="text-xs text-green-500 mt-4">Redução calculada pela meta de 80%</p>
              </div>

              <div className="p-8 border border-blue-200 rounded-3xl bg-blue-50 text-center col-span-2 shadow-sm transition-transform">
                <div className="grid grid-cols-2 divide-x divide-blue-200">
                  <div className="px-6 flex flex-col justify-center">
                    <p className="text-sm text-blue-600 uppercase font-bold tracking-widest mb-2">Ponto de Equilíbrio (Payback)</p>
                    <p className="text-4xl font-black text-blue-900">{paybackMonths < 1 ? "< 1 Mês" : `${Math.ceil(paybackMonths)} Meses`}</p>
                    <p className="text-xs text-blue-500 mt-2">A partir daqui é fluxo de caixa 100% livre.</p>
                  </div>
                  <div className="px-6 flex flex-col justify-center">
                    <p className="text-sm text-blue-600 uppercase font-bold tracking-widest mb-2">ROI Realizado (Em 1 Ano)</p>
                    <p className="text-5xl font-black text-blue-600">+{roi.toFixed(0)}%</p>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-6 mt-6">Cronograma Base (90 Dias):</h3>
            <div className="flex border-l-4 border-gray-200 ml-4 py-2">
              <div className="relative pl-8 pb-8">
                <div className="absolute w-4 h-4 bg-gray-300 rounded-full -left-[10px] top-1"></div>
                <p className="font-bold text-lg">Dias 1-30: Setup + Fundações</p>
                <p className="text-gray-600">Quick Wins na Nuvem, Padronização e Limpeza de Bancos de Dados, Concepção.</p>
              </div>
            </div>
            <div className="flex border-l-4 border-blue-200 ml-4 py-2">
              <div className="relative pl-8 pb-8">
                <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[10px] top-1 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                <p className="font-bold text-lg text-blue-900">Dias 31-60: Automações Core Lançadas</p>
                <p className="text-gray-600">Redução substancial da carga manual da equipe, Go-Live da ponte ERP &gt; E-commerce.</p>
              </div>
            </div>
            <div className="flex border-l-4 border-transparent ml-4 py-2">
              <div className="relative pl-8">
                <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-[10px] top-1 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                <p className="font-bold text-lg text-green-700">Dias 61-90: Dashboards & Estabilidade</p>
                <p className="text-gray-600">Extração C-Level para Analytics, Treinamentos da equipe e ganho de Tração Comercial.</p>
              </div>
            </div>
          </div>

          {/**************** PAGE 5: COMPARATIVO ****************/}
          <div className="pdf-a4-page w-[794px] h-[1123px] bg-white p-[60px] flex flex-col relative text-gray-900 border-b border-gray-100">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-12 border-b-4 border-gray-800 pb-4 inline-block">4. Projeção: Composição a Longo Prazo</h2>
            
            <div className="grid grid-cols-2 gap-8 mb-16 h-full">
              {/* STATUS QUO */}
              <div className="flex flex-col bg-red-50/50 rounded-3xl border border-red-100 p-8 h-full">
                <div className="text-center mb-8 border-b border-red-200 pb-6">
                  <h3 className="text-2xl font-black text-red-800">Cenário A<br/><span className="text-lg font-normal text-red-500 block mt-2">Sem Automação (Status Quo)</span></h3>
                </div>
                <div className="flex-1 space-y-6">
                  <div>
                    <span className="block text-red-600 font-black mb-1">Mês 0 (Hoje)</span>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded shadow-sm">Custo passivo de {formatCurrency(totalMonthlyLoss)} por falhas constantes.</p>
                  </div>
                  <div>
                    <span className="block text-red-600 font-black mb-1">12 Meses</span>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded shadow-sm">Acumulado queima gigantescos <strong className="text-red-600">{formatCurrency(totalMonthlyLoss * 12)}</strong> de orçamento, dificultando margem de novos investimentos.</p>
                  </div>
                  <div>
                    <span className="block text-red-600 font-black mb-1">24 Meses</span>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded shadow-sm">Risco grave de obsolescência tecnológica na escala. Equipe sobrecarregada pelo volume de clientes e alta rotatividade.</p>
                  </div>
                </div>
              </div>
              
              {/* COM AUTOMAÇÃO */}
              <div className="flex flex-col bg-green-50/50 rounded-3xl border border-green-200 shadow-xl p-8 h-full relative transform scale-105 z-10 -ml-2">
                <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-green-600 text-white font-bold px-4 py-1 rounded-full text-sm">RECOMENDADO</div>
                <div className="text-center mb-8 border-b border-green-200 pb-6">
                  <h3 className="text-2xl font-black text-green-800">Cenário B<br/><span className="text-lg font-normal text-green-500 block mt-2">Operação Modernizada</span></h3>
                </div>
                <div className="flex-1 space-y-6">
                  <div>
                    <span className="block text-green-600 font-black mb-1">Meses 1-3</span>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded shadow-sm border-l-4 border-green-400">Investimento de setup alocado com primeiros dividendos em ganho de eficiência da equipe. Integrações core finalizadas.</p>
                  </div>
                  <div>
                    <span className="block text-green-600 font-black mb-1">12 Meses</span>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded shadow-sm border-l-4 border-green-400">Fluxo rodando 100%. Saldo acumulado (pós-investimento inicial base) atinge margem líquida excelente nas DREs.</p>
                  </div>
                  <div>
                    <span className="block text-green-600 font-black mb-1">24 Meses</span>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded shadow-sm border-l-4 border-green-400">A operação fatura dobro com a mesma estrutura de equipe inicial. Margens máximas extraídas pelo sistema à prova de balas.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-10 text-center text-white mt-auto">
              <p className="text-xl font-medium text-gray-300 mb-2">Diferença de Custos Estimada após 24 meses</p>
              <h3 className="text-5xl font-black text-blue-400">{formatCurrency(((totalMonthlyLoss * 12) + (totalMonthlyLoss * 12)) * 0.8)}</h3>
              <p className="text-sm text-gray-400 mt-4 uppercase tracking-widest font-bold">Líquidos resgatados diretamente pro Caixa da Empresa</p>
            </div>
          </div>

          {/**************** PAGE 6: NEXT STEPS & OFFER ****************/}
          <div className="pdf-a4-page w-[794px] h-[1123px] bg-gradient-to-b from-white to-gray-50 p-[60px] flex flex-col relative text-gray-900 border-b border-gray-100">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-12 text-center mt-6">A Decisão Estratégica</h2>
            
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 mb-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
              <h3 className="text-2xl font-black text-gray-900 mb-4">Reunião de Diagnóstico de Código (30 min)</h3>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto text-lg">Dissecaremos pontualmente a topologia do seu ERP/Plataforma e te entregarei um road-map viável e sem compromisso para estancar essas perdas hoje.</p>
              <a href="https://calendly.com/rugemtugem/diagnostico" className="bg-gray-900 text-white font-bold px-10 py-5 rounded-2xl text-xl inline-flex items-center gap-3 cursor-pointer outline outline-offset-4 outline-2 outline-gray-200">
                Agendar Reunião Gratuita
              </a>
              <p className="text-sm text-gray-500 mt-6 font-medium">Link: calendly.com/rugemtugem/diagnostico</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-auto">
              <div>
                <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">🎁 Benefício Agendamento via Relatório</h4>
                <ul className="space-y-3 text-sm text-gray-600 pl-2">
                  <li className="flex items-start gap-2">✓ <span className="flex-1">Automação Express (Quick Win) bonificada no projeto Full-stack.</span></li>
                  <li className="flex items-start gap-2">✓ <span className="flex-1">SLA Prioritário e Suporte Executivo Contínuo.</span></li>
                  <li className="flex items-start gap-2">✓ <span className="flex-1">Análise complementar 100% gratuita sobre stack tecnológica atual.</span></li>
                </ul>
              </div>
              <div className="bg-gray-100 rounded-2xl p-6 border border-gray-200 flex flex-col justify-center">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">WhatsApp Direto Executivo</p>
                <p className="text-3xl font-black text-gray-900 mb-2">+55 11 98651-4401</p>
                <p className="text-sm text-gray-500">Mande: "Oi Fábio, gerei o Report."</p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8 flex items-center justify-between">
              <div className="w-24 h-24 bg-gray-200 rounded-full shrink-0 flex items-center justify-center overflow-hidden">
                <img src="/images/perfil.png" alt="Fábio Soares" className="w-full h-full object-cover" />
              </div>
              <div className="text-right flex-1">
                <p className="text-2xl font-black text-gray-900">Fábio Soares</p>
                <p className="text-base text-blue-600 font-bold mb-2">Tech Lead & Especialista em Automações de Alta Performance</p>
                <p className="text-sm text-gray-500">"Construindo processos à prova de balas em múltiplas operações brasileiras.<br/>E-mail: contato@rugemtugem.dev | Portfólio: rugemtugem.dev"</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
