"use client";

import { useState } from "react";

/** Botão que copia o link do adesivo. Se o navegador não deixar copiar, o texto fica selecionável ao lado. */
export function CopiarLink({ texto }: { texto: string }) {
    const [estado, setEstado] = useState<"" | "ok" | "falhou">("");
    async function copiar() {
        try {
            await navigator.clipboard.writeText(texto);
            setEstado("ok");
        } catch {
            setEstado("falhou");
        }
    }
    return (
        <span className="inline-flex items-center gap-3">
            <button type="button" onClick={copiar} className="px-5 py-2.5 rounded-lg font-semibold border-2 border-[var(--border-color)] hover:border-[var(--primary-color)]">
                Copiar link
            </button>
            <span role="status" className="text-sm text-[var(--text-secondary)]">
                {estado === "ok" && "Link copiado."}
                {estado === "falhou" && "Não deu para copiar. Selecione o link e copie à mão."}
            </span>
        </span>
    );
}
