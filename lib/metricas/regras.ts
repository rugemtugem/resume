/**
 * Regras puras do painel de métricas: período, comparação, meta e endereços do Google.
 * Sem acesso a banco nem a rede, para poder ser testado direto.
 */

export const PERIODOS = [7, 30, 90] as const;
export type Dias = (typeof PERIODOS)[number];

export interface Periodo {
    dias: number;
    /** Primeiro e último dia do período, "AAAA-MM-DD" no horário de Brasília. O último é sempre ontem. */
    inicio: string;
    fim: string;
    /** Os mesmos N dias imediatamente antes, para a comparação. */
    antInicio: string;
    antFim: string;
}

const DIA_MS = 86400e3;
const iso = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/**
 * Período de N dias completos, terminando ontem (Brasília). Hoje fica de fora porque o dia ainda
 * não acabou: comparar um dia pela metade com dias inteiros faria todo número parecer em queda.
 */
export function periodoDe(dias: number, agora = new Date()): Periodo {
    const hoje = Date.parse(`${iso(agora.getTime() - 3 * 3600e3)}T00:00:00Z`);
    const fim = hoje - DIA_MS;
    const inicio = fim - (dias - 1) * DIA_MS;
    return { dias, inicio: iso(inicio), fim: iso(fim), antInicio: iso(inicio - dias * DIA_MS), antFim: iso(inicio - DIA_MS) };
}

/** Todos os dias entre duas datas, inclusive. */
export function diasEntre(inicio: string, fim: string): string[] {
    const lista: string[] = [];
    for (let t = Date.parse(`${inicio}T00:00:00Z`); t <= Date.parse(`${fim}T00:00:00Z`); t += DIA_MS) lista.push(iso(t));
    return lista;
}

/** Série diária completa: dia sem registro vale zero. */
export function serieCompleta(inicio: string, fim: string, valores: Record<string, number>): { dia: string; valor: number }[] {
    return diasEntre(inicio, fim).map((dia) => ({ dia, valor: valores[dia] ?? 0 }));
}

/** Variação em pontos percentuais inteiros contra o período anterior. Sem base de comparação, devolve null. */
export function variacao(atual: number, anterior: number): number | null {
    if (anterior <= 0) return null;
    return Math.round(((atual - anterior) / anterior) * 100);
}

/**
 * Meta automática do período: o maior entre "15% acima do período anterior" e
 * "o ritmo dos últimos 7 dias, mantido pelo período inteiro, mais 10%". Nunca menor que 1.
 */
export function metaAutomatica(anterior: number, ultimos7: number | null, dias: number): number {
    const peloAnterior = anterior * 1.15;
    const peloRitmo = ultimos7 === null ? 0 : (ultimos7 / 7) * dias * 1.1;
    return Math.max(1, Math.ceil(Math.max(peloAnterior, peloRitmo)));
}

/** Soma dos últimos 7 valores de uma série diária. */
export function ultimos7(serie: { valor: number }[]): number {
    return serie.slice(-7).reduce((soma, d) => soma + d.valor, 0);
}

export interface EnderecosDoGoogle {
    token: string;
    ga4: string;
    gsc: string;
    /** Público-alvo que vai dentro do pedido de token. */
    publico: string;
    falsa: boolean;
}

/**
 * Trava de segurança, igual à do Instagram: fora de produção, as APIs do Google só podem apontar para
 * um endereço local. Em produção, sem a variável, valem os endereços oficiais.
 */
export function enderecosDoGoogle(env: { NODE_ENV?: string; GOOGLE_API_BASE?: string }): EnderecosDoGoogle {
    const configurada = (env.GOOGLE_API_BASE || "").replace(/\/+$/, "");
    const local = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/[a-z]+)?$/.test(configurada);
    if (env.NODE_ENV !== "production" && !local) throw new Error("Fora de produção, GOOGLE_API_BASE precisa apontar para a API falsa em localhost.");
    if (local) {
        return { token: `${configurada}/token`, ga4: `${configurada}/analyticsdata/v1beta`, gsc: `${configurada}/searchconsole/webmasters/v3`, publico: `${configurada}/token`, falsa: true };
    }
    return {
        token: "https://oauth2.googleapis.com/token",
        ga4: "https://analyticsdata.googleapis.com/v1beta",
        gsc: "https://searchconsole.googleapis.com/webmasters/v3",
        publico: "https://oauth2.googleapis.com/token",
        falsa: false,
    };
}

/** "AAAA-MM-DD" vira "DD/MM". */
export const diaCurto = (dia: string) => `${dia.slice(8, 10)}/${dia.slice(5, 7)}`;

/** Número inteiro com ponto de milhar. */
export const inteiro = (n: number) => Math.round(n).toLocaleString("pt-BR");
