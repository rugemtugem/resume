"use client";

import { useState } from "react";
import { Check, Link2, Linkedin, MessageCircle } from "lucide-react";

/** Linha de compartilhamento do post: WhatsApp, LinkedIn e copiar o link. */
export function Compartilhar({ titulo, url }: { titulo: string; url: string }) {
    const [copiado, setCopiado] = useState(false);
    const botao = "w-11 h-11 rounded-full border-2 border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] transition-colors";

    const copiar = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2500);
        } catch {}
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-[var(--text-secondary)]">Compartilhe:</span>
            <a className={botao} href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${titulo}: ${url}`)}`} target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no WhatsApp">
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
            </a>
            <a className={botao} href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no LinkedIn">
                <Linkedin className="w-5 h-5" aria-hidden="true" />
            </a>
            <button type="button" className={botao} onClick={copiar} aria-label={copiado ? "Link copiado" : "Copiar o link"}>
                {copiado ? <Check className="w-5 h-5" aria-hidden="true" /> : <Link2 className="w-5 h-5" aria-hidden="true" />}
            </button>
            <span className="text-sm text-[var(--text-secondary)]" aria-live="polite">
                {copiado ? "Link copiado" : ""}
            </span>
        </div>
    );
}
