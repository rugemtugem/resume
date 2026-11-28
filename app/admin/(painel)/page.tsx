import Link from "next/link";
import { CalendarCheck, ChartNoAxesColumn, GalleryHorizontal, Globe, Palette, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { agendaDoBlog, horaAtual, ultimoBatimento } from "@/lib/agenda";
import { exigirAdmin } from "@/lib/admin/sessao";
import { todosOsPosts } from "@/lib/blog";
import { contaConectada, filaDoInstagram } from "@/lib/instagram/fila";
import { contaDoLinkedin, filaDoLinkedin } from "@/lib/linkedin/fila";
import { roteirosSociais } from "@/lib/social";

const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;

interface Cartao {
    href: string;
    nome: string;
    texto: string;
    icone: LucideIcon;
    /** O que pede atenção agora. Aparece em destaque. */
    pendente?: string;
    /** Situação geral, em uma linha. */
    resumo: string;
}

/** Entrada do painel: um cartão por área, com o que está esperando por você em cada uma. */
export default async function InicioDoPainel() {
    await exigirAdmin();
    const agora = horaAtual();

    const agenda = agendaDoBlog();
    const posts = todosOsPosts().filter((p) => !p.rascunho);
    const aprovado = (slug: string) => agenda[slug] && (agenda[slug].status === "aprovado" || agenda[slug].status === "publicado");
    const postsParaAprovar = posts.filter((p) => !aprovado(p.slug)).length;
    const postsAgendados = posts.filter((p) => aprovado(p.slug) && Date.parse(agenda[p.slug].quando_utc) > agora).length;
    const postsNoAr = posts.length - postsParaAprovar - postsAgendados;

    const filaIg = filaDoInstagram();
    const roteiros = roteirosSociais();
    const roteirosParaAprovar = roteiros.filter((r) => r.problemas.length === 0 && !filaIg.some((p) => p.slug === r.slug && p.tipo === "carrossel")).length;
    const igAgendados = filaIg.filter((p) => p.status === "agendado").length;
    const igComErro = filaIg.filter((p) => p.status === "erro").length;

    const filaLi = filaDoLinkedin();
    const liAgendados = filaLi.filter((p) => p.status === "agendado").length;
    const liComErro = filaLi.filter((p) => p.status === "erro").length;

    const batimento = ultimoBatimento();
    const minutos = batimento ? Math.round((agora - Date.parse(batimento.em)) / 60e3) : null;
    const agendadorParado = minutos === null || minutos > 15;

    const cartoes: Cartao[] = [
        {
            href: "/admin/agenda",
            nome: "Agenda do blog",
            texto: "Aprove cada post com data e hora. Ele entra no site sozinho.",
            icone: CalendarCheck,
            pendente: postsParaAprovar > 0 ? `${plural(postsParaAprovar, "post", "posts")} para aprovar` : undefined,
            resumo: `${plural(postsAgendados, "agendado", "agendados")}, ${plural(postsNoAr, "no ar", "no ar")}.`,
        },
        {
            href: "/admin/instagram",
            nome: "Instagram",
            texto: "Carrosséis, Reels e stories dos roteiros, e a fila de publicação.",
            icone: GalleryHorizontal,
            pendente: igComErro > 0 ? `${plural(igComErro, "publicação com erro", "publicações com erro")}` : roteirosParaAprovar > 0 ? `${plural(roteirosParaAprovar, "roteiro", "roteiros")} para aprovar` : undefined,
            resumo: contaConectada() ? `${plural(igAgendados, "publicação agendada", "publicações agendadas")}.` : "Nenhuma conta conectada.",
        },
        {
            href: "/admin/linkedin",
            nome: "LinkedIn",
            texto: "A conta, os posts avulsos e a fila do seu perfil.",
            icone: Users,
            pendente: liComErro > 0 ? `${plural(liComErro, "post com erro", "posts com erro")}` : undefined,
            resumo: contaDoLinkedin() ? `${plural(liAgendados, "post agendado", "posts agendados")}.` : "Nenhuma conta conectada.",
        },
        {
            href: "/admin/metricas",
            nome: "Métricas",
            texto: "Visitas, buscas, pedidos de contato e o resultado das redes.",
            icone: ChartNoAxesColumn,
            resumo: "Períodos de 7, 30 e 90 dias, até ontem.",
        },
    ];
    const atalhos: { href: string; nome: string; texto: string; icone: LucideIcon }[] = [
        { href: "/a-marca", nome: "Guia de marca", texto: "Tom de voz, cores, fontes, ícones e peças.", icone: Palette },
        { href: "/", nome: "Ver o site", texto: "Abre o rugemtugem.dev como o visitante vê.", icone: Globe },
    ];

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Painel</h1>
                    <p className="text-[var(--text-secondary)]">Escolha por onde começar. Cada cartão mostra o que está esperando por você.</p>
                </div>
                <p className={`text-sm px-4 py-2 rounded-lg border ${agendadorParado ? "border-amber-500/50 text-amber-500" : "border-[var(--border-color)] text-[var(--text-secondary)]"}`} role="status">
                    {minutos === null ? "Agendador: ainda não rodou nenhuma vez." : `Agendador: última verificação há ${minutos} min.`}
                </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
                {cartoes.map(({ href, nome, texto, icone: Icone, pendente, resumo }) => (
                    <li key={href}>
                        <Link
                            href={href}
                            className="group flex h-full flex-col rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] p-6 transition-colors hover:border-[var(--primary-color)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-color)]"
                        >
                            <span className="flex items-center gap-3 mb-3">
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-color)]/10 text-[var(--primary-color)]">
                                    <Icone aria-hidden="true" focusable="false" className="h-6 w-6" />
                                </span>
                                <span className="text-xl font-bold">{nome}</span>
                            </span>
                            <span className="text-sm text-[var(--text-secondary)] mb-4">{texto}</span>
                            <span className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                                {pendente && <span className="px-3 py-1 rounded-full font-semibold bg-amber-500/25 text-[var(--text-primary)]">{pendente}</span>}
                                <span className="text-[var(--text-secondary)]">{resumo}</span>
                            </span>
                            <span className="mt-4 text-sm font-semibold text-[var(--primary-color)] group-hover:underline underline-offset-4">Abrir {nome}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <h2 className="text-lg font-bold mt-10 mb-3">Atalhos</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
                {atalhos.map(({ href, nome, texto, icone: Icone }) => (
                    <li key={href}>
                        <Link
                            href={href}
                            className="flex min-h-11 items-center gap-3 rounded-xl border border-[var(--border-color)] px-4 py-3 transition-colors hover:border-[var(--primary-color)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-color)]"
                        >
                            <Icone aria-hidden="true" focusable="false" className="h-5 w-5 shrink-0 text-[var(--text-secondary)]" />
                            <span className="min-w-0">
                                <span className="block font-semibold">{nome}</span>
                                <span className="block text-sm text-[var(--text-secondary)]">{texto}</span>
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
