import { createSign } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { banco } from "@/lib/db";
import { diasEntre, enderecosDoGoogle } from "@/lib/metricas/regras";
import type { Periodo } from "@/lib/metricas/regras";

/**
 * GA4 (Data API) e Search Console por conta de serviço. A chave é um arquivo JSON que fica no volume
 * do servidor, nunca no repositório. Em localhost fala só com a API falsa (scripts/graph-falsa.mjs).
 * Toda resposta fica em cache por uma hora: o painel não gasta cota a cada clique.
 */

const CACHE_MS = 3600e3;
const EVENTOS_DE_CONTATO = ["cta_click", "whatsapp_click", "email_click"];

export interface Configuracao {
    propriedade: string;
    site: string;
    chave: { client_email: string; private_key: string } | null;
    /** Motivo de não estar configurado, para mostrar no painel. Vazio quando está tudo certo. */
    falta: string;
}

export function configuracaoDoGoogle(): Configuracao {
    const propriedade = (process.env.GA4_PROPERTY_ID || "").trim();
    const site = (process.env.GSC_SITE || "").trim();
    const caminho = (process.env.GOOGLE_CHAVE || "").trim();
    const base = { propriedade, site, chave: null };
    if (!caminho) return { ...base, falta: "Falta a variável GOOGLE_CHAVE com o caminho do arquivo da conta de serviço." };
    if (!existsSync(caminho)) return { ...base, falta: "O arquivo da conta de serviço não foi encontrado no caminho configurado." };
    try {
        const chave = JSON.parse(readFileSync(caminho, "utf8")) as { client_email?: string; private_key?: string };
        if (!chave.client_email || !chave.private_key) return { ...base, falta: "O arquivo da conta de serviço está incompleto." };
        return { propriedade, site, chave: { client_email: chave.client_email, private_key: chave.private_key }, falta: "" };
    } catch {
        return { ...base, falta: "O arquivo da conta de serviço não é um JSON válido." };
    }
}

let tokenGuardado: { valor: string; ate: number } | null = null;

const b64 = (dado: string | Buffer) => Buffer.from(dado).toString("base64url");

/** Troca a chave da conta de serviço por um token de acesso de uma hora. */
async function tokenDeAcesso(chave: NonNullable<Configuracao["chave"]>): Promise<string> {
    if (tokenGuardado && tokenGuardado.ate > Date.now() + 60e3) return tokenGuardado.valor;
    const { token: endereco, publico } = enderecosDoGoogle(process.env);
    const agora = Math.floor(Date.now() / 1000);
    const corpo = `${b64(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${b64(
        JSON.stringify({
            iss: chave.client_email,
            scope: "https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly",
            aud: publico,
            iat: agora,
            exp: agora + 3600,
        }),
    )}`;
    const assinatura = createSign("RSA-SHA256").update(corpo).sign(chave.private_key);
    const resposta = await fetch(endereco, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${corpo}.${b64(assinatura)}` }),
        signal: AbortSignal.timeout(20000),
    });
    const dados = (await resposta.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error_description?: string; error?: string };
    if (!resposta.ok || !dados.access_token) throw new Error(`O Google recusou a conta de serviço: ${dados.error_description || dados.error || `resposta ${resposta.status}`}`);
    tokenGuardado = { valor: dados.access_token, ate: Date.now() + (dados.expires_in ?? 3600) * 1000 };
    return dados.access_token;
}

async function pedir(token: string, url: string, corpo: unknown): Promise<Record<string, unknown>> {
    const resposta = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(corpo), signal: AbortSignal.timeout(30000) });
    const dados = (await resposta.json().catch(() => ({}))) as Record<string, unknown>;
    if (!resposta.ok) {
        const erro = (dados.error ?? {}) as { message?: string };
        throw new Error(erro.message || `resposta ${resposta.status}`);
    }
    return dados;
}

export function doCache<T>(chave: string): T | null {
    try {
        const linha = banco()?.prepare("SELECT json FROM cache_metricas WHERE chave = ? AND ate > ?").get(chave, new Date().toISOString()) as { json: string } | undefined;
        return linha ? (JSON.parse(linha.json) as T) : null;
    } catch {
        return null;
    }
}

export function paraOCache(chave: string, valor: unknown, validadeMs = CACHE_MS): void {
    try {
        banco()
            ?.prepare("INSERT INTO cache_metricas (chave, ate, json) VALUES (?, ?, ?) ON CONFLICT(chave) DO UPDATE SET ate = excluded.ate, json = excluded.json")
            .run(chave, new Date(Date.now() + validadeMs).toISOString(), JSON.stringify(valor));
    } catch {
        // Sem cache o painel funciona igual, só consulta o Google de novo.
    }
}

export function limparCacheDeMetricas(): void {
    banco()?.prepare("DELETE FROM cache_metricas").run();
}

type Linha = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] };
type Relatorio = { rows?: Linha[] };

export interface DadosDoGa4 {
    atual: { sessoes: number; pessoas: number; paginas: number; contatos: number };
    anterior: { sessoes: number; pessoas: number; paginas: number; contatos: number };
    /** Sessões por dia do período atual. */
    porDia: Record<string, number>;
    /** Cliques em contato por dia do período atual. */
    contatosPorDia: Record<string, number>;
    canais: { nome: string; sessoes: number }[];
    paginas: { caminho: string; visualizacoes: number }[];
}

const diaDoGa = (valor: string) => `${valor.slice(0, 4)}-${valor.slice(4, 6)}-${valor.slice(6, 8)}`;
const num = (linha: Linha, i: number) => Number(linha.metricValues?.[i]?.value ?? 0);
const dim = (linha: Linha, i: number) => linha.dimensionValues?.[i]?.value ?? "";

/** Lê o GA4 em um único lote de cinco relatórios (o limite da API por chamada). */
export async function lerGa4(cfg: Configuracao, p: Periodo): Promise<DadosDoGa4> {
    if (!cfg.chave || !cfg.propriedade) throw new Error("GA4 não configurado.");
    const chave = `ga4:${cfg.propriedade}:${p.inicio}:${p.fim}`;
    const guardado = doCache<DadosDoGa4>(chave);
    if (guardado) return guardado;

    const doisPeriodos = [
        { startDate: p.inicio, endDate: p.fim, name: "atual" },
        { startDate: p.antInicio, endDate: p.antFim, name: "anterior" },
    ];
    const sohAtual = [{ startDate: p.inicio, endDate: p.fim }];
    const filtroDeContato = { filter: { fieldName: "eventName", inListFilter: { values: EVENTOS_DE_CONTATO } } };
    const token = await tokenDeAcesso(cfg.chave);
    const resposta = (await pedir(token, `${enderecosDoGoogle(process.env).ga4}/properties/${encodeURIComponent(cfg.propriedade)}:batchRunReports`, {
        requests: [
            { dateRanges: doisPeriodos, metrics: [{ name: "sessions" }, { name: "totalUsers" }, { name: "screenPageViews" }] },
            { dateRanges: sohAtual, dimensions: [{ name: "date" }], metrics: [{ name: "sessions" }], limit: 100 },
            { dateRanges: doisPeriodos, dimensions: [{ name: "eventName" }], metrics: [{ name: "eventCount" }], dimensionFilter: filtroDeContato },
            { dateRanges: sohAtual, dimensions: [{ name: "date" }], metrics: [{ name: "eventCount" }], dimensionFilter: filtroDeContato, limit: 100 },
            { dateRanges: sohAtual, dimensions: [{ name: "sessionDefaultChannelGroup" }], metrics: [{ name: "sessions" }], orderBys: [{ metric: { metricName: "sessions" }, desc: true }], limit: 8 },
        ],
    })) as { reports?: Relatorio[] };
    const [totais, diario, eventos, contatosDiarios, canais] = resposta.reports ?? [];

    const vazio = () => ({ sessoes: 0, pessoas: 0, paginas: 0, contatos: 0 });
    const dados: DadosDoGa4 = { atual: vazio(), anterior: vazio(), porDia: {}, contatosPorDia: {}, canais: [], paginas: [] };
    // Com dois períodos, a API acrescenta o nome do período como última dimensão de cada linha.
    for (const linha of totais?.rows ?? []) {
        const alvo = dim(linha, (linha.dimensionValues?.length ?? 1) - 1) === "anterior" ? dados.anterior : dados.atual;
        alvo.sessoes = num(linha, 0);
        alvo.pessoas = num(linha, 1);
        alvo.paginas = num(linha, 2);
    }
    for (const linha of eventos?.rows ?? []) {
        const alvo = dim(linha, (linha.dimensionValues?.length ?? 1) - 1) === "anterior" ? dados.anterior : dados.atual;
        alvo.contatos += num(linha, 0);
    }
    for (const linha of diario?.rows ?? []) dados.porDia[diaDoGa(dim(linha, 0))] = num(linha, 0);
    for (const linha of contatosDiarios?.rows ?? []) dados.contatosPorDia[diaDoGa(dim(linha, 0))] = num(linha, 0);
    dados.canais = (canais?.rows ?? []).map((l) => ({ nome: dim(l, 0), sessoes: num(l, 0) }));

    // As páginas mais vistas vão em uma segunda chamada: o lote acima já usa os cinco relatórios.
    const paginas = (await pedir(token, `${enderecosDoGoogle(process.env).ga4}/properties/${encodeURIComponent(cfg.propriedade)}:runReport`, {
        dateRanges: sohAtual,
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 8,
    })) as Relatorio;
    dados.paginas = (paginas.rows ?? []).map((l) => ({ caminho: dim(l, 0), visualizacoes: num(l, 0) }));

    paraOCache(chave, dados);
    return dados;
}

export interface DadosDoGsc {
    atual: { cliques: number; impressoes: number; posicao: number };
    anterior: { cliques: number; impressoes: number; posicao: number };
    porDia: Record<string, number>;
    buscas: { termo: string; cliques: number; impressoes: number; posicao: number }[];
}

type LinhaDoGsc = { keys?: string[]; clicks?: number; impressions?: number; position?: number };

/** Lê o Search Console: totais dos dois períodos, cliques por dia e as buscas que mais trouxeram clique. */
export async function lerGsc(cfg: Configuracao, p: Periodo): Promise<DadosDoGsc> {
    if (!cfg.chave || !cfg.site) throw new Error("Search Console não configurado.");
    const chave = `gsc:${cfg.site}:${p.inicio}:${p.fim}`;
    const guardado = doCache<DadosDoGsc>(chave);
    if (guardado) return guardado;

    const token = await tokenDeAcesso(cfg.chave);
    const url = `${enderecosDoGoogle(process.env).gsc}/sites/${encodeURIComponent(cfg.site)}/searchAnalytics/query`;
    const consultar = async (corpo: Record<string, unknown>) => ((await pedir(token, url, corpo)).rows as LinhaDoGsc[] | undefined) ?? [];
    const [diario, anterior, buscas] = await Promise.all([
        consultar({ startDate: p.inicio, endDate: p.fim, dimensions: ["date"], rowLimit: 100 }),
        consultar({ startDate: p.antInicio, endDate: p.antFim, rowLimit: 1 }),
        consultar({ startDate: p.inicio, endDate: p.fim, dimensions: ["query"], rowLimit: 8 }),
    ]);

    const porDia: Record<string, number> = {};
    let cliques = 0;
    let impressoes = 0;
    let posicaoPesada = 0;
    for (const linha of diario) {
        const dia = linha.keys?.[0] ?? "";
        porDia[dia] = linha.clicks ?? 0;
        cliques += linha.clicks ?? 0;
        impressoes += linha.impressions ?? 0;
        posicaoPesada += (linha.position ?? 0) * (linha.impressions ?? 0);
    }
    for (const dia of diasEntre(p.inicio, p.fim)) porDia[dia] ??= 0;
    const ant = anterior[0] ?? {};
    const dados: DadosDoGsc = {
        atual: { cliques, impressoes, posicao: impressoes > 0 ? posicaoPesada / impressoes : 0 },
        anterior: { cliques: ant.clicks ?? 0, impressoes: ant.impressions ?? 0, posicao: ant.position ?? 0 },
        porDia,
        buscas: buscas.map((l) => ({ termo: l.keys?.[0] ?? "", cliques: l.clicks ?? 0, impressoes: l.impressions ?? 0, posicao: l.position ?? 0 })),
    };
    paraOCache(chave, dados);
    return dados;
}

export const usandoGoogleFalso = () => enderecosDoGoogle(process.env).falsa;
