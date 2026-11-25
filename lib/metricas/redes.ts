import { banco } from "@/lib/db";
import { tokenDaConta } from "@/lib/instagram/fila";
import { METRICAS_DA_CONTA, lerInsightsDaMidia, lerInsightsDoDia, lerNumerosDoPerfil } from "@/lib/instagram/graph";
import { semToken } from "@/lib/instagram/regras";
import { SemPermissaoNoLinkedin, lerNumerosDoPost, lerSeguidoresDoLinkedin, lerTotaisDoLinkedin } from "@/lib/linkedin/api";
import type { MetricaDoLinkedin } from "@/lib/linkedin/api";
import { tokenDoLinkedin } from "@/lib/linkedin/fila";
import { enderecoDoPost, semTokenDoLinkedin } from "@/lib/linkedin/regras";
import { doCache, paraOCache } from "@/lib/metricas/google";
import { diaSeguinte, diasEntre, periodoDe, serieCompleta } from "@/lib/metricas/regras";
import type { Periodo } from "@/lib/metricas/regras";
import { diaDeBrasilia } from "@/lib/social/story";

/**
 * Métricas do Instagram e do LinkedIn.
 *
 * Instagram: os números da conta são capturados uma vez por dia e guardados no banco (a Meta só guarda 90 dias,
 * e o painel não pode fazer 30 chamadas a cada abertura). Os números de cada post são lidos na hora, com cache.
 *
 * LinkedIn: a leitura exige duas permissões que o app só de publicação não tem (r_member_postAnalytics e
 * r_member_profileAnalytics). Sem elas a API responde 403 e o painel mostra isso, sem quebrar.
 */

const UM_ANO = 365 * 86400e3;
const SEM_PERMISSAO = "O token do LinkedIn não tem permissão de leitura de métricas.";

function gravar(dia: string, rede: "ig" | "li", metrica: string, valor: number): void {
    banco()?.prepare("INSERT INTO rede_dia (dia, rede, metrica, valor) VALUES (?, ?, ?, ?) ON CONFLICT(dia, rede, metrica) DO UPDATE SET valor = excluded.valor").run(dia, rede, metrica, Math.round(valor));
}

function somas(rede: "ig" | "li", inicio: string, fim: string): Record<string, number> {
    const linhas = (banco()?.prepare("SELECT metrica, SUM(valor) AS n FROM rede_dia WHERE rede = ? AND dia BETWEEN ? AND ? AND metrica NOT IN ('seguidores', 'publicacoes') GROUP BY metrica").all(rede, inicio, fim) as { metrica: string; n: number }[] | undefined) ?? [];
    return Object.fromEntries(linhas.map((l) => [l.metrica, l.n]));
}

/** Seguidores hoje e quanto mudou desde o primeiro registro dentro do período. */
function seguidores(rede: "ig" | "li", p: Periodo): { total: number | null; ganho: number | null; desde: string | null } {
    const db = banco();
    const ultimo = db?.prepare("SELECT dia, valor FROM rede_dia WHERE rede = ? AND metrica = 'seguidores' ORDER BY dia DESC LIMIT 1").get(rede) as { dia: string; valor: number } | undefined;
    if (!ultimo) return { total: null, ganho: null, desde: null };
    const primeiro = db?.prepare("SELECT dia, valor FROM rede_dia WHERE rede = ? AND metrica = 'seguidores' AND dia >= ? ORDER BY dia LIMIT 1").get(rede, p.inicio) as { dia: string; valor: number } | undefined;
    if (!primeiro || primeiro.dia === ultimo.dia) return { total: ultimo.valor, ganho: null, desde: null };
    return { total: ultimo.valor, ganho: ultimo.valor - primeiro.valor, desde: primeiro.dia };
}

/**
 * Captura diária: seguidores de hoje e os números da conta dos dias que ainda faltam (até 30 para trás).
 * Ontem e anteontem são sempre lidos de novo, porque a Meta fecha os números com até 48 horas de atraso.
 */
export async function capturarRedes(agora = new Date()): Promise<string> {
    const db = banco();
    if (!db) return "";
    const hoje = diaDeBrasilia(agora);
    const partes: string[] = [];

    const ig = tokenDaConta();
    if (ig) {
        try {
            const perfil = await lerNumerosDoPerfil(ig.token);
            gravar(hoje, "ig", "seguidores", perfil.seguidores);
            gravar(hoje, "ig", "publicacoes", perfil.publicacoes);
            const p = periodoDe(30, agora);
            const jaTem = new Set((db.prepare("SELECT dia FROM rede_dia WHERE rede = 'ig' AND metrica = 'reach' AND dia BETWEEN ? AND ?").all(p.inicio, p.fim) as { dia: string }[]).map((l) => l.dia));
            const dias = diasEntre(p.inicio, p.fim);
            const pendentes = dias.filter((dia, i) => !jaTem.has(dia) || i >= dias.length - 2);
            for (const dia of pendentes) {
                const numeros = await lerInsightsDoDia(ig.ig_user_id, ig.token, dia);
                for (const metrica of METRICAS_DA_CONTA) gravar(dia, "ig", metrica, numeros[metrica] ?? 0);
            }
            paraOCache("redes:ig:erro", "", UM_ANO);
            partes.push(`Instagram: métricas de ${pendentes.length} ${pendentes.length === 1 ? "dia" : "dias"} guardadas.`);
        } catch (e) {
            const motivo = semToken(e instanceof Error ? e.message : "erro", ig.token).slice(0, 300);
            paraOCache("redes:ig:erro", motivo, UM_ANO);
            partes.push(`Instagram: métricas não lidas (${motivo}).`);
        }
    }

    const li = tokenDoLinkedin();
    if (li) {
        try {
            gravar(hoje, "li", "seguidores", await lerSeguidoresDoLinkedin(li.token));
            paraOCache("redes:li:erro", "", UM_ANO);
        } catch (e) {
            paraOCache("redes:li:erro", e instanceof SemPermissaoNoLinkedin ? SEM_PERMISSAO : semTokenDoLinkedin(e instanceof Error ? e.message : "erro", li.token).slice(0, 300), UM_ANO);
        }
    }
    return partes.join(" ");
}

export interface NumeroComparado {
    nome: string;
    explicacao: string;
    atual: number;
    anterior: number;
}

export interface PostComNumeros {
    titulo: string;
    quando: string;
    link: string;
    numeros: Record<string, number> | null;
}

export interface Redes {
    instagram: {
        conectada: boolean;
        erro: string;
        seguidores: { total: number | null; ganho: number | null; desde: string | null };
        /** Quantos dias do período já têm número guardado. */
        diasComDado: number;
        numeros: NumeroComparado[];
        alcancePorDia: { dia: string; valor: number }[];
        posts: PostComNumeros[];
    };
    linkedin: {
        conectada: boolean;
        erro: string;
        seguidores: { total: number | null; ganho: number | null; desde: string | null };
        numeros: NumeroComparado[];
        posts: PostComNumeros[];
    };
}

const NOMES_DO_IG: [string, string, string][] = [
    ["reach", "Alcance", "Contas que viram algum conteúdo, somadas dia a dia. A mesma pessoa em dois dias conta duas vezes."],
    ["views", "Visualizações", "Vezes em que posts, stories e Reels foram exibidos."],
    ["accounts_engaged", "Contas que interagiram", "Contas que curtiram, comentaram, salvaram ou compartilharam, somadas dia a dia."],
    ["total_interactions", "Interações", "Curtidas, comentários, salvamentos e compartilhamentos."],
    ["profile_links_taps", "Toques no link do perfil", "Toques no link da bio e nos botões de contato do perfil."],
];

const NOMES_DO_LI: [MetricaDoLinkedin, string, string][] = [
    ["IMPRESSION", "Impressões", "Vezes em que os seus posts apareceram na tela de alguém."],
    ["REACTION", "Reações", "Curtidas e as outras reações."],
    ["COMMENT", "Comentários", "Comentários nos seus posts."],
    ["RESHARE", "Compartilhamentos", "Vezes em que alguém repostou."],
];

async function comCache<T>(chave: string, ler: () => Promise<T>): Promise<T> {
    const guardado = doCache<T>(chave);
    if (guardado !== null) return guardado;
    const valor = await ler();
    paraOCache(chave, valor);
    return valor;
}

/** Monta o bloco das redes para o painel. Nenhuma falha de API derruba a página: vira texto de erro no bloco. */
export async function lerRedes(p: Periodo): Promise<Redes> {
    const db = banco();
    const de = `${p.inicio}T03:00:00.000Z`;

    // Instagram
    const ig = tokenDaConta();
    const atualIg = somas("ig", p.inicio, p.fim);
    const antIg = somas("ig", p.antInicio, p.antFim);
    const alcance = Object.fromEntries(((db?.prepare("SELECT dia, valor FROM rede_dia WHERE rede = 'ig' AND metrica = 'reach' AND dia BETWEEN ? AND ?").all(p.inicio, p.fim) as { dia: string; valor: number }[] | undefined) ?? []).map((l) => [l.dia, l.valor]));
    const postsIg = (db?.prepare("SELECT titulo, publicado_em, permalink, media_id FROM ig_post WHERE status = 'publicado' AND publicado_em >= ? ORDER BY publicado_em DESC LIMIT 12").all(de) as { titulo: string; publicado_em: string; permalink: string | null; media_id: string | null }[] | undefined) ?? [];
    let erroIg = doCache<string>("redes:ig:erro") ?? "";
    const comNumerosIg: PostComNumeros[] = [];
    for (const post of postsIg) {
        let numeros: Record<string, number> | null = null;
        if (ig && post.media_id && !erroIg) {
            try {
                numeros = await comCache(`ig:midia:${post.media_id}`, () => lerInsightsDaMidia(post.media_id as string, ig.token));
            } catch (e) {
                erroIg = semToken(e instanceof Error ? e.message : "erro", ig.token).slice(0, 300);
            }
        }
        comNumerosIg.push({ titulo: post.titulo, quando: post.publicado_em, link: post.permalink ?? "", numeros });
    }

    // LinkedIn
    const li = tokenDoLinkedin();
    let erroLi = doCache<string>("redes:li:erro") ?? "";
    let totaisLi: { atual: Record<MetricaDoLinkedin, number>; anterior: Record<MetricaDoLinkedin, number> } | null = null;
    const postsLi = (db?.prepare("SELECT titulo, publicado_em, post_urn FROM li_post WHERE status = 'publicado' AND publicado_em >= ? ORDER BY publicado_em DESC LIMIT 12").all(de) as { titulo: string; publicado_em: string; post_urn: string | null }[] | undefined) ?? [];
    const comNumerosLi: PostComNumeros[] = postsLi.map((post) => ({ titulo: post.titulo, quando: post.publicado_em, link: post.post_urn ? enderecoDoPost(post.post_urn) : "", numeros: null }));
    if (li && !erroLi) {
        try {
            totaisLi = await comCache(`li:totais:${p.inicio}:${p.fim}`, async () => ({
                atual: await lerTotaisDoLinkedin(li.token, p.inicio, diaSeguinte(p.fim)),
                anterior: await lerTotaisDoLinkedin(li.token, p.antInicio, diaSeguinte(p.antFim)),
            }));
            for (const [i, post] of postsLi.entries()) {
                if (post.post_urn) comNumerosLi[i].numeros = await comCache(`li:post:${post.post_urn}`, () => lerNumerosDoPost(li.token, post.post_urn as string));
            }
        } catch (e) {
            erroLi = e instanceof SemPermissaoNoLinkedin ? SEM_PERMISSAO : semTokenDoLinkedin(e instanceof Error ? e.message : "erro", li.token).slice(0, 300);
            // Guarda a recusa por uma hora, para o painel não repetir a chamada a cada abertura.
            paraOCache("redes:li:erro", erroLi);
        }
    }

    return {
        instagram: {
            conectada: Boolean(ig),
            erro: erroIg,
            seguidores: seguidores("ig", p),
            diasComDado: Object.keys(alcance).length,
            numeros: NOMES_DO_IG.map(([id, nome, explicacao]) => ({ nome, explicacao, atual: atualIg[id] ?? 0, anterior: antIg[id] ?? 0 })),
            alcancePorDia: serieCompleta(p.inicio, p.fim, alcance),
            posts: comNumerosIg,
        },
        linkedin: {
            conectada: Boolean(li),
            erro: erroLi,
            seguidores: seguidores("li", p),
            numeros: totaisLi ? NOMES_DO_LI.map(([id, nome, explicacao]) => ({ nome, explicacao, atual: totaisLi.atual[id] ?? 0, anterior: totaisLi.anterior[id] ?? 0 })) : [],
            posts: comNumerosLi,
        },
    };
}
