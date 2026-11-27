import { VERSAO_DA_API, baseDoLinkedin, enderecoDeEnvioAceito, semTokenDoLinkedin, textoParaLinkedin } from "@/lib/linkedin/regras";
import { dataDoLinkedin, entidadeDoLinkedin } from "@/lib/metricas/regras";

/**
 * Cliente da API do LinkedIn para publicar no perfil pessoal (permissões openid, profile e w_member_social).
 * Em localhost fala só com a API falsa (scripts/graph-falsa.mjs).
 */

export class ErroDoLinkedin extends Error {}
/** O token não tem a permissão pedida. Acontece com as leituras de métricas em app sem os produtos de análise. */
export class SemPermissaoNoLinkedin extends ErroDoLinkedin {}

const base = () => baseDoLinkedin(process.env);
export const usandoLinkedinFalso = () => base().falsa;

function cabecalhos(token: string, json = true): Record<string, string> {
    const c: Record<string, string> = { Authorization: `Bearer ${token}`, "LinkedIn-Version": VERSAO_DA_API, "X-Restli-Protocol-Version": "2.0.0" };
    if (json) c["Content-Type"] = "application/json";
    return c;
}

async function pedir(token: string, url: string, opcoes: RequestInit): Promise<Response> {
    let resposta: Response;
    try {
        resposta = await fetch(url, { ...opcoes, signal: AbortSignal.timeout(60000) });
    } catch (e) {
        throw new ErroDoLinkedin(semTokenDoLinkedin(`Sem resposta do LinkedIn: ${e instanceof Error ? e.message : "falha de rede"}`, token));
    }
    if (resposta.ok) return resposta;
    const corpo = (await resposta.json().catch(() => ({}))) as { message?: string; error_description?: string };
    const motivo = corpo.message || corpo.error_description || `resposta ${resposta.status}`;
    const Erro = resposta.status === 403 ? SemPermissaoNoLinkedin : ErroDoLinkedin;
    throw new Erro(semTokenDoLinkedin(`LinkedIn recusou: ${motivo}`, token));
}

export interface Perfil {
    urn: string;
    nome: string;
}

/** Confere o token e devolve quem é o dono dele. */
export async function lerPerfil(token: string): Promise<Perfil> {
    const r = (await (await pedir(token, `${base().base}/v2/userinfo`, { headers: cabecalhos(token, false) })).json()) as { sub?: string; name?: string };
    if (!r.sub) throw new ErroDoLinkedin("O LinkedIn não devolveu o identificador do perfil. Gere o token com as permissões openid, profile e w_member_social.");
    return { urn: `urn:li:person:${r.sub}`, nome: r.name || "perfil sem nome" };
}

/** Envia uma imagem e devolve o identificador dela para usar no post. */
async function enviarImagem(token: string, dono: string, bytes: Buffer): Promise<string> {
    const { base: raiz, falsa } = base();
    const r = (await (
        await pedir(token, `${raiz}/rest/images?action=initializeUpload`, { method: "POST", headers: cabecalhos(token), body: JSON.stringify({ initializeUploadRequest: { owner: dono } }) })
    ).json()) as { value?: { uploadUrl?: string; image?: string } };
    const destino = r.value?.uploadUrl;
    const imagem = r.value?.image;
    if (!destino || !imagem) throw new ErroDoLinkedin("O LinkedIn não devolveu o endereço para enviar a imagem.");
    if (!enderecoDeEnvioAceito(destino, falsa)) throw new ErroDoLinkedin("O LinkedIn devolveu um endereço de envio que não é dele. A imagem não foi enviada.");
    await pedir(token, destino, { method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/octet-stream" }, body: new Uint8Array(bytes) });
    return imagem;
}

/** Publica no perfil: só texto, texto com uma imagem ou texto com várias (de 2 a 20). Devolve o identificador do post. */
export async function publicarNoLinkedin(token: string, autor: string, texto: string, imagens: { bytes: Buffer; descricao: string }[]): Promise<string> {
    if (imagens.length > 20) throw new ErroDoLinkedin("O LinkedIn aceita no máximo 20 imagens por post.");
    const enviadas: { id: string; altText: string }[] = [];
    for (const imagem of imagens) enviadas.push({ id: await enviarImagem(token, autor, imagem.bytes), altText: imagem.descricao.slice(0, 120) });

    const corpo: Record<string, unknown> = {
        author: autor,
        commentary: textoParaLinkedin(texto),
        visibility: "PUBLIC",
        distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false,
    };
    if (enviadas.length === 1) corpo.content = { media: enviadas[0] };
    if (enviadas.length > 1) corpo.content = { multiImage: { images: enviadas } };

    const resposta = await pedir(token, `${base().base}/rest/posts`, { method: "POST", headers: cabecalhos(token), body: JSON.stringify(corpo) });
    const id = resposta.headers.get("x-restli-id");
    if (!id) throw new ErroDoLinkedin("O LinkedIn aceitou o post, mas não devolveu o identificador.");
    return id;
}

export const METRICAS_DO_LINKEDIN = ["IMPRESSION", "REACTION", "COMMENT", "RESHARE"] as const;
export type MetricaDoLinkedin = (typeof METRICAS_DO_LINKEDIN)[number];

async function contar(token: string, consulta: string): Promise<number> {
    // Os parênteses e os dois-pontos destes parâmetros não podem ser codificados: a URL é montada à mão.
    const r = (await (await pedir(token, `${base().base}/rest/memberCreatorPostAnalytics?${consulta}`, { headers: cabecalhos(token, false) })).json()) as { elements?: { count?: number }[] };
    return (r.elements ?? []).reduce((soma, e) => soma + Number(e.count ?? 0), 0);
}

/** Total de seguidores do perfil. Exige a permissão r_member_profileAnalytics. */
export async function lerSeguidoresDoLinkedin(token: string): Promise<number> {
    const r = (await (await pedir(token, `${base().base}/rest/memberFollowersCount?q=me`, { headers: cabecalhos(token, false) })).json()) as { elements?: { memberFollowersCount?: number }[] };
    return Number(r.elements?.[0]?.memberFollowersCount ?? 0);
}

/** Totais de todos os posts do perfil entre dois dias (o fim é exclusivo). Exige a permissão r_member_postAnalytics. */
export async function lerTotaisDoLinkedin(token: string, inicio: string, fimExclusivo: string): Promise<Record<MetricaDoLinkedin, number>> {
    const periodo = `dateRange=(start:${dataDoLinkedin(inicio)},end:${dataDoLinkedin(fimExclusivo)})`;
    const valores = await Promise.all(METRICAS_DO_LINKEDIN.map((m) => contar(token, `q=me&queryType=${m}&aggregation=TOTAL&${periodo}`)));
    return Object.fromEntries(METRICAS_DO_LINKEDIN.map((m, i) => [m, valores[i]])) as Record<MetricaDoLinkedin, number>;
}

/** Números de um post desde a publicação. */
export async function lerNumerosDoPost(token: string, urn: string): Promise<Record<MetricaDoLinkedin, number> | null> {
    const entidade = entidadeDoLinkedin(urn);
    if (!entidade) return null;
    const valores = await Promise.all(METRICAS_DO_LINKEDIN.map((m) => contar(token, `q=entity&entity=${entidade}&queryType=${m}&aggregation=TOTAL`)));
    return Object.fromEntries(METRICAS_DO_LINKEDIN.map((m, i) => [m, valores[i]])) as Record<MetricaDoLinkedin, number>;
}
