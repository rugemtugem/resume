/**
 * Regras puras do LinkedIn: endereço da API, formato do texto e validação.
 * Sem acesso a banco nem a rede, para poder ser testado direto.
 */

/** Versão da API enviada no cabeçalho LinkedIn-Version. Cada versão vale por pelo menos um ano. */
export const VERSAO_DA_API = "202611";

const TRAVESSOES = [String.fromCharCode(0x2014), String.fromCharCode(0x2013)];

/**
 * Trava de segurança, igual à do Instagram: fora de produção, a API só pode apontar para um endereço local.
 * Assim um arquivo de ambiente errado em localhost nunca publica de verdade.
 */
export function baseDoLinkedin(env: { NODE_ENV?: string; LINKEDIN_API_BASE?: string }): { base: string; falsa: boolean } {
    const configurada = (env.LINKEDIN_API_BASE || "").replace(/\/+$/, "");
    const local = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/[a-z]+)?$/.test(configurada);
    if (env.NODE_ENV !== "production") {
        if (!local) throw new Error("Fora de produção, LINKEDIN_API_BASE precisa apontar para a API falsa em localhost.");
        return { base: configurada, falsa: true };
    }
    // Em produção, uma variável apontando para outro servidor é ignorada: o token nunca sai para um endereço que não seja o do LinkedIn.
    return { base: local ? configurada : "https://api.linkedin.com", falsa: local };
}

/** O endereço de envio de imagem vem na resposta da API. Só é aceito se for do próprio LinkedIn (ou local, no modo de teste). */
export function enderecoDeEnvioAceito(endereco: string, falsa: boolean): boolean {
    if (falsa) return /^http:\/\/(localhost|127\.0\.0\.1|host\.docker\.internal)[:/]/.test(endereco);
    try {
        const u = new URL(endereco);
        return u.protocol === "https:" && /(^|\.)(linkedin\.com|licdn\.com)$/.test(u.hostname);
    } catch {
        return false;
    }
}

/** Problemas do texto que impedem o agendamento. Lista vazia quer dizer que está tudo certo. */
export function problemasDoTexto(texto: string): string[] {
    const problemas: string[] = [];
    const limpo = texto.trim();
    if (limpo.length === 0) problemas.push("O texto do LinkedIn está vazio.");
    if (limpo.length > 3000) problemas.push(`O texto do LinkedIn tem ${limpo.length} caracteres. O limite é 3.000.`);
    if (/#[\p{L}\p{N}_]*ferrugem/iu.test(limpo)) problemas.push("Tire a hashtag com \"ferrugem\" do texto do LinkedIn.");
    if (TRAVESSOES.some((t) => limpo.includes(t))) problemas.push("O texto do LinkedIn tem travessão. Troque por vírgula, ponto ou dois-pontos.");
    return problemas;
}

/**
 * Converte o texto para o formato que a API exige: os caracteres reservados ganham barra invertida
 * e cada hashtag vira o elemento de hashtag. Sem isso a API corta o texto no primeiro parêntese.
 */
export function textoParaLinkedin(texto: string): string {
    const escapar = (t: string) => t.replace(/[\\|{}@[\]()<>#*_~]/g, (c) => `\\${c}`);
    return texto
        .split(/(#[\p{L}\p{N}_]+)/u)
        .map((parte) => (/^#[\p{L}\p{N}_]+$/u.test(parte) ? `{hashtag|\\#|${escapar(parte.slice(1))}}` : escapar(parte)))
        .join("");
}

/** Troca {link} pelo endereço da página, já com a origem marcada para a medição. */
export function comLink(texto: string, site: string, caminho: string, campanha: string): string {
    const endereco = `${site.replace(/\/+$/, "")}${caminho}?utm_source=linkedin&utm_medium=social&utm_campaign=${campanha}`;
    return texto.split("{link}").join(endereco);
}

/** Tira o token de qualquer texto antes de ele virar erro, registro ou tela. */
export function semTokenDoLinkedin(texto: string, token = ""): string {
    let limpo = texto;
    if (token) limpo = limpo.split(token).join("[token]");
    return limpo.replace(/Bearer\s+[A-Za-z0-9._-]{10,}/g, "Bearer [token]");
}

/** Endereço público do post a partir do identificador que a API devolve. */
export function enderecoDoPost(urn: string): string {
    return `https://www.linkedin.com/feed/update/${urn}/`;
}
