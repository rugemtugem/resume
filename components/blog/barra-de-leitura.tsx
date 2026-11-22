"use client";

import { useEffect, useState } from "react";

/** Barra fina no topo que mostra quanto do post já foi lido. Também conta a leitura, uma vez por visita. */
export function BarraDeLeitura({ slug }: { slug: string }) {
    const [progresso, setProgresso] = useState(0);

    useEffect(() => {
        const artigo = document.querySelector<HTMLElement>("[data-post-conteudo]");
        if (!artigo) return;
        const atualizar = () => {
            const inicio = artigo.offsetTop - 96;
            const fim = artigo.offsetTop + artigo.offsetHeight - window.innerHeight;
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
        <div className="fixed top-0 inset-x-0 z-[70] h-1 bg-transparent" aria-hidden="true">
            <div className="h-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] origin-left" style={{ transform: `scaleX(${progresso})` }} />
        </div>
    );
}
