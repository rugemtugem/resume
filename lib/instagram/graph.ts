import { baseDaGraph, semToken } from "@/lib/instagram/regras";
import { valorDoInsight } from "@/lib/metricas/regras";

/**
 * Cliente da API do Instagram (login do Instagram), portado do publicador do Calcula Trabalhador.
 * Em localhost fala só com a API falsa (scripts/graph-falsa.mjs).
 */

const VERSAO = "v23.0";

export class ErroDoInstagram extends Error {}

function enderecos() {
    const { base, falsa } = baseDaGraph(process.env);
    return { raiz: base, api: `${base}/${VERSAO}`, falsa };
}

const pausa = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function pedir(metodo: "GET" | "POST", url: string, token: string, params: Record<string, string> = {}): Promise<Record<string, unknown>> {
    const corpo = new URLSearchParams({ ...params, access_token: token });
    let ultimo = "";
    for (let tentativa = 1; tentativa <= 3; tentativa++) {
        try {
            const resposta = await fetch(metodo === "GET" ? `${url}?${corpo}` : url, {
                method: metodo,
                body: metodo === "POST" ? corpo : undefined,
                signal: AbortSignal.timeout(30000),
            });
            const dados = (await resposta.json().catch(() => ({}))) as Record<string, unknown>;
            if (resposta.ok && !dados.error) return dados;
            const erro = (dados.error ?? {}) as { message?: string; is_transient?: boolean };
            ultimo = erro.message || `resposta ${resposta.status}`;
            if (!erro.is_transient && resposta.status < 500) break;
        } catch (e) {
            ultimo = e instanceof Error ? e.message : "falha de rede";
        }
        await pausa(1000 * tentativa);
    }
    throw new ErroDoInstagram(semToken(`Instagram recusou: ${ultimo}`, token));
}

export interface Conta {
    ig_user_id: string;
    username: string;
    account_type: string;
}

export async function lerConta(token: string): Promise<Conta> {
    const r = await pedir("GET", `${enderecos().api}/me`, token, { fields: "user_id,username,account_type" });
    const id = String(r.user_id ?? r.id ?? "");
    if (!id || !r.username) throw new ErroDoInstagram("A API não devolveu os dados da conta.");
    return { ig_user_id: id, username: String(r.username), account_type: String(r.account_type ?? "") };
}

/** Cota de publicação das últimas 24 horas. */
export async function lerCota(igUserId: string, token: string): Promise<{ usados: number; total: number }> {
    const r = await pedir("GET", `${enderecos().api}/${encodeURIComponent(igUserId)}/content_publishing_limit`, token, { fields: "quota_usage,config" });
    const d = ((r.data as Record<string, unknown>[] | undefined) ?? [])[0] ?? {};
    const config = (d.config ?? {}) as { quota_total?: number };
    return { usados: Number(d.quota_usage ?? 0), total: Number(config.quota_total ?? 100) };
}

async function criarContainer(igUserId: string, token: string, params: Record<string, string>): Promise<string> {
    const r = await pedir("POST", `${enderecos().api}/${encodeURIComponent(igUserId)}/media`, token, params);
    if (!r.id) throw new ErroDoInstagram("A API não devolveu o id do contêiner.");
    return String(r.id);
}

/** Espera o contêiner ficar pronto. A Meta baixa e processa a mídia antes de liberar. */
async function aguardar(containerId: string, token: string, limiteS = 120): Promise<void> {
    const { api, falsa } = enderecos();
    const inicio = Date.now();
    let intervalo = 10;
    for (;;) {
        const r = await pedir("GET", `${api}/${encodeURIComponent(containerId)}`, token, { fields: "status_code,status" });
        const estado = String(r.status_code ?? "");
        if (estado === "FINISHED" || estado === "PUBLISHED") return;
        if (estado === "ERROR" || estado === "EXPIRED") {
            throw new ErroDoInstagram(`O Instagram não aceitou a mídia (${estado}): ${String(r.status ?? "sem detalhe")}.`);
        }
        if (Date.now() - inicio > limiteS * 1000) throw new ErroDoInstagram(`A mídia não terminou de processar em ${limiteS} s.`);
        await pausa(falsa ? 50 : intervalo * 1000);
        intervalo = Math.min(30, intervalo + 5);
    }
}

async function publicarContainer(igUserId: string, token: string, containerId: string): Promise<string> {
    const r = await pedir("POST", `${enderecos().api}/${encodeURIComponent(igUserId)}/media_publish`, token, { creation_id: containerId });
    if (!r.id) throw new ErroDoInstagram("A API não devolveu o id da publicação.");
    return String(r.id);
}

async function lerPermalink(mediaId: string, token: string): Promise<string> {
    try {
        const r = await pedir("GET", `${enderecos().api}/${encodeURIComponent(mediaId)}`, token, { fields: "permalink" });
        return String(r.permalink ?? "");
    } catch {
        return ""; // a publicação já saiu; o link é só conveniência
    }
}

export interface Publicado {
    media_id: string;
    permalink: string;
}

export async function publicarImagem(igUserId: string, token: string, url: string, legenda: string): Promise<Publicado> {
    const c = await criarContainer(igUserId, token, { image_url: url, caption: legenda });
    await aguardar(c, token);
    const m = await publicarContainer(igUserId, token, c);
    return { media_id: m, permalink: await lerPermalink(m, token) };
}

/** Carrossel de 2 a 10 imagens JPEG, na ordem. */
export async function publicarCarrossel(igUserId: string, token: string, urls: string[], legenda: string): Promise<Publicado> {
    if (urls.length < 2 || urls.length > 10) throw new ErroDoInstagram(`Carrossel precisa de 2 a 10 imagens (vieram ${urls.length}).`);
    const filhos: string[] = [];
    for (const url of urls) filhos.push(await criarContainer(igUserId, token, { image_url: url, is_carousel_item: "true" }));
    for (const filho of filhos) await aguardar(filho, token);
    const pai = await criarContainer(igUserId, token, { media_type: "CAROUSEL", children: filhos.join(","), caption: legenda });
    await aguardar(pai, token);
    const m = await publicarContainer(igUserId, token, pai);
    return { media_id: m, permalink: await lerPermalink(m, token) };
}

/** Renova o token de longa duração (vale 60 dias). */
export async function renovarToken(token: string): Promise<{ token: string; segundos: number }> {
    const r = await pedir("GET", `${enderecos().raiz}/refresh_access_token`, token, { grant_type: "ig_refresh_token" });
    if (!r.access_token) throw new ErroDoInstagram("A renovação não devolveu um token novo.");
    return { token: String(r.access_token), segundos: Number(r.expires_in ?? 5184000) };
}

/** Diz se o site está falando com a API falsa. O painel mostra isso em destaque. */
export function usandoApiFalsa(): boolean {
    try {
        return enderecos().falsa;
    } catch {
        return true;
    }
}

/** Seguidores e total de publicações do perfil. */
export async function lerNumerosDoPerfil(token: string): Promise<{ seguidores: number; publicacoes: number }> {
    const r = await pedir("GET", `${enderecos().api}/me`, token, { fields: "followers_count,media_count" });
    return { seguidores: Number(r.followers_count ?? 0), publicacoes: Number(r.media_count ?? 0) };
}

export const METRICAS_DA_CONTA = ["reach", "views", "accounts_engaged", "total_interactions", "profile_links_taps"] as const;
export const METRICAS_DO_POST = ["reach", "views", "likes", "comments", "saved", "shares"] as const;

/** Números da conta em um dia (do início do dia em Brasília até o início do seguinte). Exige a permissão de insights. */
export async function lerInsightsDoDia(igUserId: string, token: string, dia: string): Promise<Record<string, number>> {
    const desde = Math.floor(Date.parse(`${dia}T03:00:00Z`) / 1000);
    const r = await pedir("GET", `${enderecos().api}/${encodeURIComponent(igUserId)}/insights`, token, {
        metric: METRICAS_DA_CONTA.join(","),
        period: "day",
        metric_type: "total_value",
        since: String(desde),
        until: String(desde + 86400),
    });
    const itens = (r.data as { name: string; total_value?: { value?: number }; values?: { value?: number }[] }[] | undefined) ?? [];
    return Object.fromEntries(itens.map((i) => [i.name, valorDoInsight(i)]));
}

/** Números de uma publicação. A Meta atrasa esses dados em até 48 horas. */
export async function lerInsightsDaMidia(mediaId: string, token: string): Promise<Record<string, number>> {
    const r = await pedir("GET", `${enderecos().api}/${encodeURIComponent(mediaId)}/insights`, token, { metric: METRICAS_DO_POST.join(",") });
    const itens = (r.data as { name: string; total_value?: { value?: number }; values?: { value?: number }[] }[] | undefined) ?? [];
    return Object.fromEntries(itens.map((i) => [i.name, valorDoInsight(i)]));
}
