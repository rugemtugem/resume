import Link from "next/link";
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

/** Moldura das páginas fora da home: menu, caminho de navegação, conteúdo e rodapé. */
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
            <main className="min-h-screen pt-28 pb-20 px-4 md:px-8">
                <div className="max-w-4xl mx-auto">
                    <nav aria-label="Caminho de navegação" className="mb-8 text-sm text-[var(--text-secondary)]">
                        <ol className="flex flex-wrap items-center gap-2">
                            {migalhas.map((m, i) => (
                                <li key={m.nome} className="flex items-center gap-2">
                                    {i > 0 && <span aria-hidden="true">/</span>}
                                    {m.href ? (
                                        <Link href={m.href} className="underline hover:text-[var(--text-primary)]">
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
                    </nav>
                    {children}
                </div>
            </main>
            <Footer />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        </>
    );
}

/** Chamada única do site: o diagnóstico gratuito de 30 minutos. */
export function ChamadaDiagnostico({ local }: { local: string }) {
    return (
        <section
            data-local={local}
            className="mt-16 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-8 text-center"
        >
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-3">
                Diagnóstico gratuito de 30 minutos
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto mb-6">
                Você conta como o processo funciona hoje. Eu digo o que dá para ligar, o que não vale a pena e por
                onde começar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                    href={WHATSAPP}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] hover:shadow-lg transition-all"
                >
                    Pedir pelo WhatsApp
                </a>
                <Link
                    href="/#contact"
                    data-cta={`${local}_formulario`}
                    data-cta-destino="contato"
                    className="px-6 py-3 rounded-xl font-semibold border-2 border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-all"
                >
                    Escrever pelo formulário
                </Link>
            </div>
        </section>
    );
}
