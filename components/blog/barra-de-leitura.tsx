"use client";

import { useEffect, useState } from "react";

/** Barra colada embaixo do menu. Aparece quando a miniatura do post chega ao menu e enche até o fim do artigo. Também conta a leitura, uma vez por visita. */
export function BarraDeLeitura({ slug }: { slug: string }) {
    const [progresso, setProgresso] = useState(0);
    const [topo, setTopo] = useState(72);
    const [visivel, setVisivel] = useState(false);

    useEffect(() => {
        const artigo = document.querySelector<HTMLElement>("[data-post-conteudo]");
        if (!artigo) return;
        const menu = document.querySelector<HTMLElement>("nav");
        const capa = document.querySelector<HTMLElement>("[data-post-capa]");
        const atualizar = () => {
            // A barra fica colada embaixo do menu fixo, e acompanha a altura dele.
            if (menu) setTopo(menu.offsetHeight);
            // A leitura começa quando a miniatura do post encosta no menu e termina no fim do artigo.
            // As posições são da página inteira (offsetTop sozinho é relativo ao bloco pai).
            const alturaDoMenu = menu ? menu.offsetHeight : 0;
            const comeco = (capa ?? artigo).getBoundingClientRect();
            const inicio = comeco.top + window.scrollY - alturaDoMenu;
            const fim = artigo.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
            setVisivel(window.scrollY >= inicio);
            const p = fim <= inicio ? 1 : (window.scrollY - inicio) / (fim - inicio);
            setProgresso(Math.min(1, Math.max(0, p)));
        };
        atualizar();
        window.addEventListener("scroll", atualizar, { passive: true });
        window.addEventListener("resize", atualizar, { passive: true });
        return () => {
            window.removeEventListener("scroll", atualizar);
            window.removeEventListener("resize", atualizar);
        };
    }, []);

    useEffect(() => {
        const chave = `leitura:${slug}`;
        try {
            if (sessionStorage.getItem(chave)) return;
        } catch {
            return;
        }
        const espera = setTimeout(() => {
            try {
                sessionStorage.setItem(chave, "1");
            } catch {}
            fetch("/api/blog/view", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }), keepalive: true }).catch(() => {});
        }, 2000);
        return () => clearTimeout(espera);
    }, [slug]);

    return (
        <div
            className={`fixed inset-x-0 z-[49] h-1.5 bg-[var(--border-color)]/40 transition-opacity duration-300 ${visivel ? "opacity-100" : "opacity-0"}`}
            style={{ top: topo }}
            role="progressbar"
            aria-label="Progresso da leitura"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progresso * 100)}
        >
            <div
                className="h-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] origin-left transition-transform duration-150 ease-out"
                style={{ transform: `scaleX(${progresso})` }}
            />
        </div>
    );
}
