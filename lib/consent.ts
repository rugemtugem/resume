/** Escolha de cookies do visitante. Fica só no navegador, exatamente como a pessoa marcou. */
export type Consentimento = "aceito" | "recusado";

const CHAVE = "consentimento-cookies";
export const EVENTO_CONSENTIMENTO = "consentimento-mudou";

export function lerConsentimento(): Consentimento | null {
    try {
        const v = window.localStorage.getItem(CHAVE);
        return v === "aceito" || v === "recusado" ? v : null;
    } catch {
        return null;
    }
}

export function gravarConsentimento(valor: Consentimento): void {
    try {
        window.localStorage.setItem(CHAVE, valor);
    } catch {
        // Sem armazenamento, a escolha vale só para esta visita.
    }
    window.dispatchEvent(new CustomEvent(EVENTO_CONSENTIMENTO, { detail: valor }));
}
