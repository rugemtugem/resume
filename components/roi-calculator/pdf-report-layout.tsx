import React from 'react';

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
};

interface PdfReportLayoutProps {
  name: string;
  empresa: string;
  revenue: number;
  hours: number;
  hourlyCost: number;
  totalMonthlyLoss: number;
  savingsMonthly: number;
  roi: number;
  averageAutomationCost: number;
  annualSavings: number;
  paybackMonths: number;
  monthlyLostCost: number;
  opportunityCost: number;
}

export function PdfReportLayout({
  name,
  empresa,
  revenue,
  hours,
  hourlyCost,
  totalMonthlyLoss,
  savingsMonthly,
  roi,
  averageAutomationCost,
  annualSavings,
  paybackMonths,
  monthlyLostCost,
  opportunityCost,
}: PdfReportLayoutProps) {
  return (
    <div 
      id="pdf-report-container" 
      // Offscreen wrapper
      style={{ position: 'absolute', top: '-10000px', left: 0, overflow: 'hidden' }}
    >
      {/**************** PAGE 1: CAPA ****************/}
      <div className="pdf-a4-page relative overflow-hidden flex flex-col items-center justify-center text-center p-[60px]" style={{ width: '794px', height: '1123px', backgroundColor: '#0f172a' }}>
        
        {/* Simple Background without Blur */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '500px', height: '500px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%' }} />
        
        <h1 className="text-white text-5xl font-black mb-8 leading-tight tracking-tight relative z-10">
          ANÁLISE DE ROI <br/><span className="text-blue-400">PERSONALIZADA</span>
        </h1>
        <p className="text-xl text-gray-300 font-medium mb-2 relative z-10">Preparado exclusivamente para:</p>
        <p className="text-4xl text-white font-black mb-12 relative z-10">{empresa || name}</p>
        
        {/* Simple Solid Container Instead of Backdrop-Blur */}
        <div className="w-full relative z-10 rounded-3xl p-10 mb-16" style={{ maxWidth: '600px', backgroundColor: '#1e293b', border: '1px solid #334155' }}>
          <div className="mb-6">
            <p className="text-gray-300 text-lg mb-2">💸 Você está perdendo:</p>
            <p className="text-red-400 text-4xl font-black">{formatCurrency(totalMonthlyLoss)} <span className="text-lg font-normal text-red-300">/ mês</span></p>
          </div>
          <div className="mb-6">
            <p className="text-gray-300 text-lg mb-2">✅ Potencial de economia:</p>
            <p className="text-green-400 text-4xl font-black">{formatCurrency(savingsMonthly)} <span className="text-lg font-normal text-green-300">/ mês</span></p>
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
      <div className="pdf-a4-page flex flex-col text-gray-900 border-b border-gray-100" style={{ width: '794px', height: '1123px', backgroundColor: '#ffffff', padding: '60px', boxSizing: 'border-box' }}>
        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-8 pb-4 inline-block" style={{ borderBottom: '4px solid #3b82f6', alignSelf: 'flex-start' }}>1. O Retrato Atual</h2>
        
        <h3 className="text-xl font-bold text-gray-800 mb-4">Dados Informados na Operação:</h3>
        <div className="rounded-2xl p-6 border border-gray-200 mb-10 bg-gray-50">
          <div className="flex justify-between border-b border-gray-200 py-3"><span className="font-semibold text-gray-600">Receita Mensal</span><span className="font-bold text-gray-900">{formatCurrency(revenue)}</span></div>
          <div className="flex justify-between border-b border-gray-200 py-3"><span className="font-semibold text-gray-600">Horas em Processos Manuais</span><span className="font-bold text-gray-900">{hours} horas/semana</span></div>
          <div className="flex justify-between py-3"><span className="font-semibold text-gray-600">Custo da Equipe</span><span className="font-bold text-gray-900">{formatCurrency(hourlyCost)}/hora</span></div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-4">O Custo Silencioso do Retrabalho:</h3>
        <div className="rounded-2xl p-8 border mb-10" style={{ backgroundColor: '#fef2f2', borderColor: '#fee2e2' }}>
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold text-gray-700">Gargalo Semanal Direto:</span>
            <span className="text-2xl font-bold text-red-600">{formatCurrency(monthlyLostCost / 4)}</span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold text-gray-700">Custo de Oportunidade Mensal:</span>
            <span className="text-2xl font-bold text-red-600">{formatCurrency(opportunityCost)}</span>
          </div>
          <div className="border-t my-6" style={{ borderColor: '#fecaca' }}></div>
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
        
        <div className="flex flex-col space-y-4">
          <div className="flex items-center bg-gray-50 p-4 mb-4 rounded-xl border border-gray-200">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4 shrink-0">1</div>
            <div>
              <p className="font-bold text-gray-900 m-0">Gestão de Pedidos e NF-e</p>
              <p className="text-sm text-gray-500 m-0">Alto Risco de Erro Humano | Esforço Diário</p>
            </div>
          </div>
          <div className="flex items-center bg-gray-50 p-4 mb-4 rounded-xl border border-gray-200">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4 shrink-0">2</div>
            <div>
              <p className="font-bold text-gray-900 m-0">Relatórios Gerenciais Manuais</p>
              <p className="text-sm text-gray-500 m-0">Decisões com dados defasados | Esforço Semanal</p>
            </div>
          </div>
          <div className="flex items-center bg-gray-50 p-4 mb-4 rounded-xl border border-gray-200">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4 shrink-0">3</div>
            <div>
              <p className="font-bold text-gray-900 m-0">Follow-up e Atendimento</p>
              <p className="text-sm text-gray-500 m-0">Lentidão na resposta a leads quente | Alto Impacto de Vendas</p>
            </div>
          </div>
        </div>
      </div>

      {/**************** PAGE 3: SOLUÇÕES ****************/}
      <div className="pdf-a4-page flex flex-col text-gray-900 border-b border-gray-100" style={{ width: '794px', height: '1123px', backgroundColor: '#ffffff', padding: '60px', boxSizing: 'border-box' }}>
        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-8 pb-4 inline-block" style={{ borderBottom: '4px solid #22c55e', alignSelf: 'flex-start' }}>2. Plano de Ação Personalizado</h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Substituindo esforço manual por automações escaláveis, nossa meta principal é reduzir 80% dessas horas perdidas, convertendo-as em vendas e alívio de margem.
        </p>

        {/* Without Shadow on html2canvas, simpler borders */}
        <div className="bg-white border-l-4 border-gray-200 p-8 mb-8" style={{ borderLeftColor: '#2563eb' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-blue-700 m-0">🥇 Prioridade 1: Automação Core End-to-End</h3>
            <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">Meses 1-2</span>
          </div>
          <p className="text-gray-600 mb-6">Integração fluida entre ERP, Meio de Pagamento e Plataforma de Vendas limitando interações humanas a apenas aprovações e exceções críticas.</p>
          <div className="flex bg-gray-50 p-4 rounded-xl">
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1 m-0">Tempo Recuperado</p>
              <p className="text-lg font-bold text-gray-900 m-0">Até 60% das horas</p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1 m-0">Impacto Imediato</p>
              <p className="text-lg font-bold text-green-600 m-0">Zero Erros Fiscais</p>
            </div>
          </div>
        </div>

        <div className="bg-white border-l-4 border-gray-200 p-8 mb-8" style={{ borderLeftColor: '#9333ea' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-purple-700 m-0">🥈 Prioridade 2: Conversão Autônoma Integrada</h3>
            <span className="bg-purple-100 text-purple-800 text-sm font-bold px-3 py-1 rounded-full">Meses 2-3</span>
          </div>
          <p className="text-gray-600 mb-6">Conexão de RD Station/HubSpot com WhatsApp API (Suri, Z-API) para nutrição de leads, disparos automáticos de fatura e onboarding humanizado.</p>
          <div className="flex bg-gray-50 p-4 rounded-xl">
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1 m-0">Aumento de Receita</p>
              <p className="text-lg font-bold text-gray-900 m-0">+15% a 30% Convertidos</p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1 m-0">Tempo de Resposta</p>
              <p className="text-lg font-bold text-green-600 m-0">&lt; 3 Segundos</p>
            </div>
          </div>
        </div>

        <div className="bg-white border-l-4 border-gray-200 p-8" style={{ borderLeftColor: '#f97316' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-orange-600 m-0">💡 Quick Win Imediato: Dashboard C-Level</h3>
            <span className="bg-orange-100 text-orange-800 text-sm font-bold px-3 py-1 rounded-full">Semana 1-2</span>
          </div>
          <p className="text-gray-600 mb-6">Consolidação dos dados espalhados em uma única visão (PowerBI ou Painel Customizado React). Decisões assertivas em tempo real no lugar de planilhas de final de mês.</p>
          <div className="flex bg-gray-50 p-4 rounded-xl">
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1 m-0">Setup Previsto</p>
              <p className="text-lg font-bold text-gray-900 m-0">Expresso</p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1 m-0">Visão</p>
              <p className="text-lg font-bold text-green-600 m-0">Lucro Real Diário</p>
            </div>
          </div>
        </div>
      </div>

      {/**************** PAGE 4: ROADMAP E ROI ****************/}
      <div className="pdf-a4-page flex flex-col text-gray-900 border-b border-gray-100" style={{ width: '794px', height: '1123px', backgroundColor: '#ffffff', padding: '60px', boxSizing: 'border-box' }}>
        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-8 pb-4 inline-block" style={{ borderBottom: '4px solid #eab308', alignSelf: 'flex-start' }}>3. Projeção de Retorno (ROI)</h2>

        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
          Baseado na implementação dos motores de automação mapeados, este é o cenário conservador de rentabilidade sobre a modernização tecnológica para faturamentos de <b>{formatCurrency(revenue)}</b>.
        </p>

        {/* Explicit flex row layout without gap and grid */}
        <div className="flex w-full mb-6">
          <div className="w-1/2 rounded-3xl bg-gray-50 text-center p-8 border border-gray-200 mr-3">
            <p className="text-sm text-gray-500 uppercase font-bold tracking-widest mb-3 m-0">Orçamento Estimado Setup</p>
            <div className="flex items-center justify-center h-16">
              <p className="text-4xl font-black text-gray-900 m-0">{formatCurrency(averageAutomationCost)}</p>
            </div>
            <p className="text-xs text-gray-400 mt-4 m-0">*Média típica para integração full-stack</p>
          </div>
          
          <div className="w-1/2 rounded-3xl bg-green-50 text-center p-8 border border-green-200 ml-3">
            <p className="text-sm text-green-600 uppercase font-bold tracking-widest mb-3 m-0">Economia Gerada (12 Meses)</p>
            <div className="flex items-center justify-center h-16">
              <p className="text-4xl font-black text-green-600 m-0">{formatCurrency(annualSavings)}</p>
            </div>
            <p className="text-xs text-green-500 mt-4 m-0">Redução calculada pela meta de 80%</p>
          </div>
        </div>

        <div className="w-full rounded-3xl bg-blue-50 text-center border border-blue-200 mb-12 flex">
          <div className="w-1/2 p-8 border-r border-blue-200 flex flex-col justify-center">
            <p className="text-sm text-blue-600 uppercase font-bold tracking-widest mb-2 m-0">Ponto de Equilíbrio (Payback)</p>
            <p className="text-4xl font-black text-blue-900 m-0">{paybackMonths < 1 ? "< 1 Mês" : `${Math.ceil(paybackMonths)} Meses`}</p>
            <p className="text-xs text-blue-500 mt-2 m-0">A partir daqui é fluxo de caixa 100% livre.</p>
          </div>
          <div className="w-1/2 p-8 flex flex-col justify-center">
            <p className="text-sm text-blue-600 uppercase font-bold tracking-widest mb-2 m-0">ROI Realizado (Em 1 Ano)</p>
            <p className="text-5xl font-black text-blue-600 m-0">+{roi.toFixed(0)}%</p>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-6 mt-6">Cronograma Base (90 Dias):</h3>
        {/* Simplified timeline without complex relative positioning dot if it breaks HTML2Canvas */}
        <div className="flex flex-col ml-4">
          <div className="border-l-4 border-gray-300 pl-6 pb-6 mb-2 pt-1">
            <p className="font-bold text-lg m-0">Dias 1-30: Setup + Fundações</p>
            <p className="text-gray-600 mt-1 mb-0">Quick Wins na Nuvem, Padronização e Limpeza de Bancos de Dados, Concepção.</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-6 pb-6 mb-2 pt-1">
            <p className="font-bold text-lg text-blue-900 m-0">Dias 31-60: Automações Core Lançadas</p>
            <p className="text-gray-600 mt-1 mb-0">Redução substancial da carga manual da equipe, Go-Live da ponte ERP &gt; E-commerce.</p>
          </div>
          <div className="border-l-4 border-green-500 pl-6 pt-1 pb-4">
            <p className="font-bold text-lg text-green-700 m-0">Dias 61-90: Dashboards & Estabilidade</p>
            <p className="text-gray-600 mt-1 mb-0">Extração C-Level para Analytics, Treinamentos da equipe e ganho de Tração Comercial.</p>
          </div>
        </div>
      </div>

      {/**************** PAGE 5: COMPARATIVO ****************/}
      <div className="pdf-a4-page flex flex-col text-gray-900 border-b border-gray-100" style={{ width: '794px', height: '1123px', backgroundColor: '#ffffff', padding: '60px', boxSizing: 'border-box' }}>
        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-12 pb-4 inline-block" style={{ borderBottom: '4px solid #1f2937', alignSelf: 'flex-start' }}>4. Projeção: Composição a Longo Prazo</h2>
        
        <div className="flex w-full mb-16" style={{ height: '700px' }}>
          {/* STATUS QUO */}
          <div className="w-1/2 flex flex-col bg-red-50 rounded-3xl border border-red-100 p-8 mr-4">
            <div className="text-center mb-8 border-b border-red-200 pb-6">
              <h3 className="text-2xl font-black text-red-800 m-0">Cenário A<br/><span className="text-lg font-normal text-red-500 block mt-2">Sem Automação (Status Quo)</span></h3>
            </div>
            <div className="flex-1 flex flex-col space-y-6">
              <div className="mb-6">
                <span className="block text-red-600 font-black mb-1">Mês 0 (Hoje)</span>
                <p className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-100 m-0">Custo passivo de {formatCurrency(totalMonthlyLoss)} por falhas constantes.</p>
              </div>
              <div className="mb-6">
                <span className="block text-red-600 font-black mb-1">12 Meses</span>
                <p className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-100 m-0">Acumulado queima gigantescos <strong className="text-red-600">{formatCurrency(totalMonthlyLoss * 12)}</strong> de orçamento, dificultando margem de novos investimentos.</p>
              </div>
              <div>
                <span className="block text-red-600 font-black mb-1">24 Meses</span>
                <p className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-100 m-0">Risco grave de obsolescência tecnológica na escala. Equipe sobrecarregada pelo volume de clientes e alta rotatividade.</p>
              </div>
            </div>
          </div>
          
          {/* COM AUTOMAÇÃO */}
          <div className="w-1/2 flex flex-col rounded-3xl border border-green-200 p-8 ml-4 relative" style={{ backgroundColor: '#f0fdf4' }}>
            <div className="absolute top-0 right-6 text-white font-bold px-4 py-1 rounded-full text-sm" style={{ backgroundColor: '#16a34a', transform: 'translateY(-50%)' }}>RECOMENDADO</div>
            <div className="text-center mb-8 border-b border-green-200 pb-6">
              <h3 className="text-2xl font-black text-green-800 m-0">Cenário B<br/><span className="text-lg font-normal text-green-500 block mt-2">Operação Modernizada</span></h3>
            </div>
            <div className="flex-1 flex flex-col space-y-6">
              <div className="mb-6">
                <span className="block text-green-600 font-black mb-1">Meses 1-3</span>
                <p className="text-sm text-gray-600 bg-white p-3 rounded border-l-4 border-gray-100 m-0" style={{ borderLeftColor: '#4ade80' }}>Investimento de setup alocado com primeiros dividendos em ganho de eficiência da equipe. Integrações core finalizadas.</p>
              </div>
              <div className="mb-6">
                <span className="block text-green-600 font-black mb-1">12 Meses</span>
                <p className="text-sm text-gray-600 bg-white p-3 rounded border-l-4 border-gray-100 m-0" style={{ borderLeftColor: '#4ade80' }}>Fluxo rodando 100%. Saldo acumulado (pós-investimento inicial base) atinge margem líquida excelente nas DREs.</p>
              </div>
              <div>
                <span className="block text-green-600 font-black mb-1">24 Meses</span>
                <p className="text-sm text-gray-600 bg-white p-3 rounded border-l-4 border-gray-100 m-0" style={{ borderLeftColor: '#4ade80' }}>A operação fatura dobro com a mesma estrutura de equipe inicial. Margens máximas extraídas pelo sistema à prova de balas.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl p-10 text-center text-white mt-auto" style={{ backgroundColor: '#111827' }}>
          <p className="text-xl font-medium text-gray-300 mb-2 mt-0">Diferença de Custos Estimada após 24 meses</p>
          <h3 className="text-5xl font-black text-blue-400 m-0">{formatCurrency(((totalMonthlyLoss * 12) + (totalMonthlyLoss * 12)) * 0.8)}</h3>
          <p className="text-sm text-gray-400 mt-4 uppercase tracking-widest font-bold mb-0">Líquidos resgatados diretamente pro Caixa da Empresa</p>
        </div>
      </div>

      {/**************** PAGE 6: NEXT STEPS & OFFER ****************/}
      <div className="pdf-a4-page flex flex-col text-gray-900 border-b border-gray-100" style={{ width: '794px', height: '1123px', backgroundColor: '#fafafa', padding: '60px', boxSizing: 'border-box' }}>
        <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-12 text-center mt-6">A Decisão Estratégica</h2>
        
        {/* Simple strong container without advanced CSS features */}
        <div className="bg-white rounded-3xl border border-gray-200 p-10 mb-10 text-center">
          <h3 className="text-2xl font-black text-gray-900 mb-4 m-0">Reunião de Diagnóstico de Código (30 min)</h3>
          <p className="text-gray-600 mb-8 mx-auto text-lg" style={{ maxWidth: '400px' }}>Dissecaremos pontualmente a topologia do seu ERP/Plataforma e te entregarei um road-map viável e sem compromisso para estancar essas perdas hoje.</p>
          
          {/* Ultra simple solid button */}
          <div className="inline-block text-white font-bold px-10 py-5 rounded-2xl text-xl" style={{ backgroundColor: '#111827' }}>
             Agendar Reunião Gratuita
          </div>
          <p className="text-sm text-gray-500 mt-6 font-medium mb-0">Acesse: calendly.com/rugemtugem/diagnostico</p>
        </div>

        <div className="flex w-full mb-auto mt-6">
          <div className="w-1/2 pr-6">
            <h4 className="font-bold text-gray-800 text-lg mb-4 m-0">🎁 Benefício Agendamento via Relatório</h4>
            <div className="flex flex-col space-y-3 text-sm text-gray-600 mt-4">
              <div className="flex items-start mb-2"><span className="mr-2 font-bold">✓</span> <span className="flex-1">Automação Express (Quick Win) bonificada no projeto Full-stack.</span></div>
              <div className="flex items-start mb-2"><span className="mr-2 font-bold">✓</span> <span className="flex-1">SLA Prioritário e Suporte Executivo Contínuo.</span></div>
              <div className="flex items-start"><span className="mr-2 font-bold">✓</span> <span className="flex-1">Análise complementar 100% gratuita sobre stack tecnológica atual.</span></div>
            </div>
          </div>
          
          <div className="w-1/2 bg-gray-100 rounded-2xl p-6 border border-gray-200 flex flex-col justify-center">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 m-0">WhatsApp Direto Executivo</p>
            <p className="text-2xl font-black text-gray-900 mb-2 m-0">+55 11 98651-4401</p>
            <p className="text-sm text-gray-500 m-0">Mande: "Oi Fábio, gerei o Report."</p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 flex items-center justify-between" style={{ marginTop: 'auto' }}>
          <div className="w-24 h-24 bg-gray-200 rounded-full shrink-0 flex items-center justify-center overflow-hidden mr-6">
            <img src="/images/perfil.png" alt="Fábio" style={{ width: '96px', height: '96px', objectFit: 'cover', borderRadius: '50%' }} />
          </div>
          <div className="text-right flex-1">
            <p className="text-2xl font-black text-gray-900 m-0">Fábio Soares</p>
            <p className="text-base text-blue-600 font-bold mb-2 m-0">Tech Lead & Especialista em Automações de Alta Performance</p>
            <p className="text-sm text-gray-500 m-0">Construindo processos à prova de balas em múltiplas operações brasileiras.<br/>E-mail: contato@rugemtugem.dev | Portfólio: rugemtugem.dev</p>
          </div>
        </div>
      </div>
    </div>
  );
}
