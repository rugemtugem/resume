"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EVENTO_CONSENTIMENTO, gravarConsentimento, lerConsentimento } from "@/lib/consent";

/** Aviso de cookies. Aparece enquanto a pessoa não escolheu. */
export function CookieBanner() {
    const pathname = usePathname();
    const [visivel, setVisivel] = useState(false);

    useEffect(() => {
        const atualizar = () => setVisivel(lerConsentimento() === null);
        atualizar();
        window.addEventListener(EVENTO_CONSENTIMENTO, atualizar);
        return () => window.removeEventListener(EVENTO_CONSENTIMENTO, atualizar);
    }, []);

    // O painel não mede visita nem mostra o aviso.
    if (!visivel || pathname.startsWith("/admin")) return null;

    return (
        <div
            role="region"
            aria-label="Aviso de cookies"
            className="fixed bottom-0 inset-x-0 z-[60] border-t border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-2xl"
        >
            <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center gap-4">
                <p className="text-sm text-[var(--text-secondary)] flex-1">
                    Este site usa o Google Analytics para saber quais páginas são visitadas e quais botões de contato
                    são clicados. Ele só é ligado se você aceitar.{" "}
                    <Link href="/privacidade" className="underline text-[var(--text-primary)]">
                        Política de privacidade
                    </Link>
                </p>
                <div className="flex gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={() => gravarConsentimento("recusado")}
                        className="px-4 py-2 rounded-lg border-2 border-[var(--border-color)] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors"
                    >
                        Recusar
                    </button>
                    <button
                        type="button"
                        onClick={() => gravarConsentimento("aceito")}
                        className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] hover:shadow-lg transition-all"
                    >
                        Aceitar
                    </button>
                </div>
            </div>
        </div>
    );
}

/** Mostra a escolha atual e deixa trocar. Usado na página de privacidade. */
export function EscolhaDeCookies() {
    const [escolha, setEscolha] = useState<string>("carregando");

    useEffect(() => {
        const atualizar = () => setEscolha(lerConsentimento() ?? "sem escolha");
        atualizar();
        window.addEventListener(EVENTO_CONSENTIMENTO, atualizar);
        return () => window.removeEventListener(EVENTO_CONSENTIMENTO, atualizar);
    }, []);

    const rotulo: Record<string, string> = {
        aceito: "Você aceitou a medição.",
        recusado: "Você recusou a medição.",
        "sem escolha": "Você ainda não escolheu.",
        carregando: "",
    };

    return (
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5">
            <p className="text-sm text-[var(--text-primary)] mb-4" aria-live="polite">
                {rotulo[escolha]}
            </p>
            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={() => gravarConsentimento("aceito")}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]"
                >
                    Aceitar a medição
                </button>
                <button
                    type="button"
                    onClick={() => gravarConsentimento("recusado")}
                    className="px-4 py-2 rounded-lg border-2 border-[var(--border-color)] text-sm font-semibold text-[var(--text-primary)]"
                >
                    Recusar a medição
                </button>
            </div>
        </div>
    );
}
