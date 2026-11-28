"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// A tela do roteiro (/admin/social/...) é aberta a partir do Instagram, então marca o Instagram.
const ITENS: { href: string; nome: string; tambem?: string }[] = [
    { href: "/admin", nome: "Agenda do blog" },
    { href: "/admin/instagram", nome: "Instagram", tambem: "/admin/social" },
    { href: "/admin/linkedin", nome: "LinkedIn" },
    { href: "/admin/metricas", nome: "Métricas" },
];

const base = "inline-flex items-center min-h-11 px-3 rounded-lg font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-color)]";

/** Menu do painel. Marca a tela atual com cor, fundo e aria-current, para a pessoa saber onde está. */
export function MenuDoPainel() {
    const caminho = usePathname() || "";
    const atual = (item: (typeof ITENS)[number]) =>
        item.href === "/admin" ? caminho === "/admin" : caminho === item.href || caminho.startsWith(`${item.href}/`) || Boolean(item.tambem && caminho.startsWith(item.tambem));

    return (
        <nav aria-label="Painel" className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm whitespace-nowrap">
            {ITENS.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    aria-current={atual(item) ? "page" : undefined}
                    className={`${base} ${atual(item) ? "bg-[var(--primary-color)]/10 text-[var(--primary-color)] underline underline-offset-8 decoration-2" : "text-[var(--text-primary)] hover:bg-[var(--border-color)]/40"}`}
                >
                    {item.nome}
                </Link>
            ))}
            <Link href="/" className={`${base} font-normal text-[var(--text-secondary)] hover:text-[var(--text-primary)]`}>
                Ver o site
            </Link>
        </nav>
    );
}
