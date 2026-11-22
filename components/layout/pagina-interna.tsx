import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export interface Migalha {
    nome: string;
    href?: string;
}

const SITE = "https://rugemtugem.dev";
const WHATSAPP =
    "https://wa.me/5511986514401?text=" +
    encodeURIComponent("Oi, Fábio! Quero agendar o diagnóstico gratuito de 30 minutos.");

/** Os mesmos gradientes dos ícones do processo na home. */
export const GRADIENTES = [
    "linear-gradient(135deg, #992A2B 0%, #EE6936 100%)",
    "linear-gradient(135deg, #EE6936 0%, #ff6b6b 100%)",
    "linear-gradient(135deg, #ff6b6b 0%, #ffa94d 100%)",
    "linear-gradient(135deg, #992A2B 0%, #ff6b6b 100%)",
    "linear-gradient(135deg, #EE6936 0%, #ffa94d 100%)",
];

/** Brilho de fundo usado nas seções da home (duas manchas de cor desfocadas). */
function Brilho() {
    return (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)]/5 via-transparent to-[var(--secondary-color)]/5" />
            <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[var(--primary-color)]/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-[var(--secondary-color)]/10 rounded-full blur-3xl" />
        </div>
    );
}

/** Moldura das páginas fora da home: menu, conteúdo em faixas e rodapé. */
export function PaginaInterna({ migalhas, children }: { migalhas: Migalha[]; children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: migalhas.map((m, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: m.nome,
            ...(m.href ? { item: `${SITE}${m.href === "/" ? "" : m.href}` } : {}),
        })),
    };

    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        </>
    );
}

/** Topo da página interna, no mesmo desenho do topo da home: selo, título com destaque e texto. */
export function TopoInterno({
    migalhas,
    selo,
    titulo,
    destaque,
    texto,
    children,
    comCapa = false,
}: {
    /** Deixa espaço embaixo para a capa do post, que sobe sobre o topo. */
    comCapa?: boolean;
    migalhas: Migalha[];
    selo: string;
    titulo: string;
    destaque?: string;
    texto: string;
    children?: React.ReactNode;
}) {
    return (
        <section className={`relative overflow-hidden pt-32 md:pt-40 px-4 md:px-8 ${comCapa ? "pb-40 md:pb-48" : "pb-16 md:pb-20"}`}>
            <Brilho />
            <div className="max-w-5xl mx-auto relative z-10 text-center">
                <div role="navigation" aria-label="Caminho de navegação" className="mb-8 text-sm text-[var(--text-secondary)]">
                    <ol className="flex flex-wrap items-center justify-center gap-2">
                        {migalhas.map((m, i) => (
                            <li key={m.nome} className="flex items-center gap-2">
                                {i > 0 && <span aria-hidden="true">/</span>}
                                {m.href ? (
                                    <Link href={m.href} className="hover:text-[var(--primary-color)] transition-colors">
                                        {m.nome}
                                    </Link>
                                ) : (
                                    <span aria-current="page" className="text-[var(--text-primary)]">
                                        {m.nome}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ol>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] mb-8">
                    <Sparkles className="w-4 h-4 text-[var(--primary-color)]" aria-hidden="true" />
                    <span className="text-sm font-medium">{selo}</span>
                </div>

                <h1 className="text-[2rem] md:text-6xl font-bold mb-6 leading-tight">
                    {titulo}
                    {destaque && (
                        <>
                            {" "}
                            <span className="text-gradient-neon">{destaque}</span>
                        </>
                    )}
                </h1>

                <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
                    {texto}
                </p>

                {children && <div className="mt-10">{children}</div>}
            </div>
        </section>
    );
}

/** Faixa de conteúdo. Alterna o fundo como as seções da home. */
export function Faixa({
    fundo = "primario",
    largura = "max-w-6xl",
    children,
}: {
    fundo?: "primario" | "secundario";
    largura?: string;
    children: React.ReactNode;
}) {
    return (
        <section className={`py-16 md:py-20 px-4 md:px-8 ${fundo === "secundario" ? "bg-[var(--bg-secondary)]" : ""}`}>
            <div className={`${largura} mx-auto`}>{children}</div>
        </section>
    );
}

/** Cabeçalho de seção igual ao da home: rótulo, título com destaque e descrição. */
export function TituloDeSecao({ rotulo, titulo, destaque, texto }: { rotulo: string; titulo: string; destaque: string; texto?: string }) {
    return (
        <div className="mb-12 text-center">
            <p className="text-sm font-semibold text-[var(--primary-color)] uppercase tracking-wider mb-4">{rotulo}</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
                {titulo} <span className="text-gradient-neon">{destaque}</span>
            </h2>
            {texto && <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">{texto}</p>}
        </div>
    );
}

/** Cartão de vidro do processo da home. */
export function CartaoVidro({ className = "", children }: { className?: string; children: React.ReactNode }) {
    return (
        <div
            className={`group relative h-full p-6 md:p-8 rounded-2xl overflow-hidden bg-[var(--bg-primary)]/60 backdrop-blur-xl border border-[var(--border-color)]/50 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-[var(--primary-color)]/40 hover:-translate-y-1 transition-all duration-300 ${className}`}
        >
            {children}
        </div>
    );
}

/** Quadrado de ícone com gradiente, como nos passos do processo da home. */
export function IconeGradiente({ icone: Icone, indice = 0, numero }: { icone: LucideIcon; indice?: number; numero?: string }) {
    return (
        <div
            className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shadow-lg border border-white/10 shrink-0"
            style={{ background: GRADIENTES[indice % GRADIENTES.length] }}
        >
            <Icone className="w-6 h-6 md:w-7 md:h-7 text-white" aria-hidden="true" />
            {numero && (
                <span className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center text-xs font-bold text-[var(--text-primary)] shadow-sm">
                    {numero}
                </span>
            )}
        </div>
    );
}

/** Chamada única do site: o diagnóstico gratuito de 30 minutos. Mesmo bloco de fecho do processo na home. */
export function ChamadaDiagnostico({ local }: { local: string }) {
    return (
        <section data-local={local} className="relative overflow-hidden py-16 md:py-20 px-4 md:px-8 bg-[var(--bg-secondary)]">
            <Brilho />
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="relative p-8 md:p-12 rounded-3xl overflow-hidden text-center bg-[var(--bg-primary)]/60 backdrop-blur-xl border border-[var(--border-color)]/50 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Diagnóstico gratuito de <span className="text-gradient-neon">30 minutos</span>
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
                        Você conta como o processo funciona hoje. Eu digo o que dá para ligar, o que não vale a pena e
                        por onde começar.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a
                            href={WHATSAPP}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all inline-flex items-center justify-center gap-2"
                        >
                            <Calendar className="w-5 h-5" aria-hidden="true" />
                            Pedir pelo WhatsApp
                        </a>
                        <Link
                            href="/#contact"
                            data-cta={`${local}_formulario`}
                            data-cta-destino="contato"
                            className="px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold border-2 border-[var(--border-color)] hover:bg-[var(--bg-primary)] transition-all inline-flex items-center justify-center gap-2"
                        >
                            Escrever pelo formulário
                            <ArrowRight className="w-5 h-5" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

/** Botões do topo: o principal leva ao diagnóstico e o secundário a outra página. */
export function BotoesDoTopo({ local, secundario }: { local: string; secundario: { href: string; texto: string } }) {
    return (
        <div data-local={local} className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all inline-flex items-center justify-center gap-2"
            >
                Pedir o diagnóstico gratuito
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </a>
            <Link
                href={secundario.href}
                className="px-8 py-4 rounded-xl font-semibold border-2 border-[var(--primary-color)]/60 hover:bg-[var(--bg-secondary)] transition-all inline-flex items-center justify-center"
            >
                {secundario.texto}
            </Link>
        </div>
    );
}
