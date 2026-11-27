import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Senha e sessão do admin, só com o que já vem no Node.
 * Senha: scrypt com sal. Sessão: validade assinada com HMAC, guardada num cookie.
 */

const b64 = (b: Buffer) => b.toString("base64url");

/** Gera o valor de ADMIN_SENHA_HASH a partir da senha. */
export function hashSenha(senha: string): string {
    const sal = randomBytes(16);
    // Separador ":". Com cifrão, o arquivo de ambiente do Next trocaria os trechos por variáveis.
    return `scrypt:${b64(sal)}:${b64(scryptSync(senha, sal, 64))}`;
}

export function conferirSenha(senha: string, guardado: string): boolean {
    const [tipo, sal, hash] = guardado.split(":");
    if (tipo !== "scrypt" || !sal || !hash) return false;
    const esperado = Buffer.from(hash, "base64url");
    // Um hash cortado (variável colada pela metade) viraria um resumo vazio, e resumo vazio "confere" com qualquer senha.
    if (esperado.length !== 64 || Buffer.from(sal, "base64url").length < 16) return false;
    const obtido = scryptSync(senha, Buffer.from(sal, "base64url"), esperado.length);
    return obtido.length === esperado.length && timingSafeEqual(obtido, esperado);
}

export const DURACAO_DA_SESSAO_MS = 8 * 3600e3;

/** Cria o valor do cookie: validade + assinatura. */
export function assinarSessao(segredo: string, agora = Date.now()): string {
    const corpo = b64(Buffer.from(JSON.stringify({ exp: agora + DURACAO_DA_SESSAO_MS })));
    return `${corpo}.${b64(createHmac("sha256", segredo).update(corpo).digest())}`;
}

/** Diz se o cookie é válido e ainda não venceu. */
export function sessaoValida(cookie: string | undefined, segredo: string, agora = Date.now()): boolean {
    if (!cookie || !segredo) return false;
    const [corpo, assinatura] = cookie.split(".");
    if (!corpo || !assinatura) return false;
    const esperada = createHmac("sha256", segredo).update(corpo).digest();
    const recebida = Buffer.from(assinatura, "base64url");
    if (recebida.length !== esperada.length || !timingSafeEqual(recebida, esperada)) return false;
    try {
        const { exp } = JSON.parse(Buffer.from(corpo, "base64url").toString("utf8")) as { exp: number };
        return typeof exp === "number" && exp > agora;
    } catch {
        return false;
    }
}

/** "2026-12-02T09:00" no horário de Brasília vira ISO em UTC. Devolve null se o texto for inválido. */
export function brasiliaParaUtc(valor: string): string | null {
    const m = valor.trim().match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})$/);
    if (!m) return null;
    const [, ano, mes, dia, hora, minuto] = m;
    const d = new Date(Date.UTC(+ano, +mes - 1, +dia, +hora + 3, +minuto));
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** ISO em UTC vira "2026-12-02T09:00" no horário de Brasília, para o campo de data do formulário. */
export function utcParaBrasilia(iso: string): string {
    return new Date(Date.parse(iso) - 3 * 3600e3).toISOString().slice(0, 16);
}

/** Regra da Agenda: o post aparece se foi aprovado e o horário já venceu. */
export function visivelNaAgenda(linha: { status: string; quando_utc: string } | undefined, agora = Date.now()): boolean {
    if (!linha) return false;
    return (linha.status === "aprovado" || linha.status === "publicado") && Date.parse(linha.quando_utc) <= agora;
}
