import { lerConsentimento } from "@/lib/consent";

export const GA_ID = "G-M2K9HY4EXN";

/** Únicos parâmetros que podem ir para o GA4. Nome, e-mail, telefone e mensagem nunca entram. */
const PERMITIDOS = new Set([
    "button_location",
    "cta_id",
    "cta_destination",
    "form_name",
    "lead_source_declared",
    "has_whatsapp",
    "error_type",
]);

type Valor = string | number | boolean;

declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
    }
}

/** Envia um evento ao GA4. Não faz nada sem o aceite do visitante. */
export function track(nome: string, parametros: Record<string, Valor> = {}): void {
    if (typeof window === "undefined") return;
    if (lerConsentimento() !== "aceito" || typeof window.gtag !== "function") return;

    const limpos: Record<string, Valor> = {};
    for (const [chave, valor] of Object.entries(parametros)) {
        if (PERMITIDOS.has(chave)) limpos[chave] = valor;
    }
    const emTeste =
        window.location.hostname === "localhost" || window.location.search.includes("debug_mode=1");
    if (emTeste) limpos.debug_mode = true;

    window.gtag("event", nome, limpos);
}
