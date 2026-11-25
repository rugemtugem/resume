import { ultimoBatimento } from "@/lib/agenda";
import { banco } from "@/lib/db";
import { configuracaoDoGoogle, lerGa4, lerGsc } from "@/lib/metricas/google";
import type { DadosDoGa4, DadosDoGsc } from "@/lib/metricas/google";
import { metaAutomatica, periodoDe, serieCompleta, ultimos7, variacao } from "@/lib/metricas/regras";
import type { Periodo } from "@/lib/metricas/regras";

export type IdDoIndicador = "sessoes" | "buscas" | "contatos" | "leads" | "leituras";

export interface Indicador {
    id: IdDoIndicador;
    nome: string;
    explicacao: string;
    fonte: string;
    valor: number;
    anterior: number;
    variacao: number | null;
    meta: number;
    metaFixa: boolean;
    serie: { dia: string; valor: number }[];
    /** Preenchido quando a fonte não respondeu: o cartão mostra o motivo no lugar do número. */
    indisponivel: string;
}

export interface Alerta {
    tipo: "atencao" | "aviso";
    texto: string;
}

export interface Painel {
    periodo: Periodo;
    indicadores: Indicador[];
    alertas: Alerta[];
    funil: { nome: string; valor: number }[] | null;
    canais: { nome: string; sessoes: number }[];
    paginas: { caminho: string; visualizacoes: number }[];
    buscas: DadosDoGsc["buscas"];
    posicao: { atual: number; anterior: number } | null;
    origens: { origem: string; total: number }[];
    publicacoes: { blog: number; instagram: number; linkedin: number; stories: number };
    google: { ga4: string; gsc: string };
}

const ORIGENS: Record<string, string> = { instagram: "Instagram", google: "Google", ia: "IA (ChatGPT, Perplexity e outras)", indicacao: "Indicação", linkedin: "LinkedIn", outro: "Outro" };

/** Soma por dia de uma tabela de contagem, entre duas datas. */
function porDia(tabela: "lead_dia" | "blog_leitura_dia" | "story_clique", coluna: "total" | "cliques", inicio: string, fim: string): Record<string, number> {
    const linhas = (banco()?.prepare(`SELECT dia, SUM(${coluna}) AS n FROM ${tabela} WHERE dia BETWEEN ? AND ? GROUP BY dia`).all(inicio, fim) as { dia: string; n: number }[] | undefined) ?? [];
    return Object.fromEntries(linhas.map((l) => [l.dia, l.n]));
}

const soma = (valores: Record<string, number>) => Object.values(valores).reduce((a, b) => a + b, 0);

/** Quantas publicações saíram no período. As datas do banco estão em UTC; o corte usa o dia de Brasília. */
function publicadosEntre(tabela: "ig_post" | "li_post" | "blog_agenda", coluna: "publicado_em" | "quando_utc", p: Periodo): number {
    const de = `${p.inicio}T03:00:00.000Z`;
    const ate = new Date(Date.parse(`${p.fim}T03:00:00.000Z`) + 86400e3).toISOString();
    const filtro = tabela === "blog_agenda" ? "status IN ('aprovado', 'publicado')" : "status = 'publicado'";
    return (banco()?.prepare(`SELECT COUNT(*) AS n FROM ${tabela} WHERE ${filtro} AND ${coluna} >= ? AND ${coluna} < ?`).get(de, ate) as { n: number } | undefined)?.n ?? 0;
}

export function metasFixas(): Partial<Record<IdDoIndicador, number>> {
    const linhas = (banco()?.prepare("SELECT chave, valor FROM admin_meta").all() as { chave: string; valor: number }[] | undefined) ?? [];
    return Object.fromEntries(linhas.map((l) => [l.chave, l.valor]));
}

/** Grava a meta fixa de um indicador para o período de 30 dias. Zero ou vazio volta para a meta automática. */
export function gravarMetaFixa(id: IdDoIndicador, valor: number): void {
    const db = banco();
    if (!db) return;
    if (valor > 0) db.prepare("INSERT INTO admin_meta (chave, valor) VALUES (?, ?) ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor").run(id, Math.round(valor));
    else db.prepare("DELETE FROM admin_meta WHERE chave = ?").run(id);
}

export async function montarPainel(dias: number, agora = new Date()): Promise<Painel> {
    const p = periodoDe(dias, agora);
    const cfg = configuracaoDoGoogle();
    const fixas = metasFixas();

    let ga4: DadosDoGa4 | null = null;
    let gsc: DadosDoGsc | null = null;
    let faltaGa4 = cfg.falta || (cfg.propriedade ? "" : "Falta a variável GA4_PROPERTY_ID.");
    let faltaGsc = cfg.falta || (cfg.site ? "" : "Falta a variável GSC_SITE.");
    const [rGa4, rGsc] = await Promise.allSettled([faltaGa4 ? Promise.reject(new Error(faltaGa4)) : lerGa4(cfg, p), faltaGsc ? Promise.reject(new Error(faltaGsc)) : lerGsc(cfg, p)]);
    if (rGa4.status === "fulfilled") ga4 = rGa4.value;
    else faltaGa4 = faltaGa4 || `O GA4 não respondeu: ${rGa4.reason instanceof Error ? rGa4.reason.message : "erro"}`;
    if (rGsc.status === "fulfilled") gsc = rGsc.value;
    else faltaGsc = faltaGsc || `O Search Console não respondeu: ${rGsc.reason instanceof Error ? rGsc.reason.message : "erro"}`;

    const leads = porDia("lead_dia", "total", p.inicio, p.fim);
    const leadsAnt = soma(porDia("lead_dia", "total", p.antInicio, p.antFim));
    const leituras = porDia("blog_leitura_dia", "total", p.inicio, p.fim);
    const leiturasAnt = soma(porDia("blog_leitura_dia", "total", p.antInicio, p.antFim));

    // A meta fixa é digitada para 30 dias e vale proporcionalmente nos outros períodos.
    const indicador = (id: IdDoIndicador, nome: string, explicacao: string, fonte: string, valor: number, anterior: number, valores: Record<string, number>, indisponivel = ""): Indicador => {
        const serie = serieCompleta(p.inicio, p.fim, valores);
        const fixa = fixas[id];
        return {
            id,
            nome,
            explicacao,
            fonte,
            valor,
            anterior,
            variacao: variacao(valor, anterior),
            meta: fixa ? Math.max(1, Math.round((fixa * dias) / 30)) : metaAutomatica(anterior, dias > 7 ? ultimos7(serie) : null, dias),
            metaFixa: Boolean(fixa),
            serie,
            indisponivel,
        };
    };

    const indicadores: Indicador[] = [
        indicador("sessoes", "Visitas", "Sessões no site, só de quem aceitou os cookies de medição.", "GA4", ga4?.atual.sessoes ?? 0, ga4?.anterior.sessoes ?? 0, ga4?.porDia ?? {}, faltaGa4),
        indicador("buscas", "Cliques vindos do Google", "Vezes em que alguém clicou no site em um resultado de busca.", "Search Console", gsc?.atual.cliques ?? 0, gsc?.anterior.cliques ?? 0, gsc?.porDia ?? {}, faltaGsc),
        indicador("contatos", "Cliques em contato", "Cliques nos botões de diagnóstico, WhatsApp e e-mail, só de quem aceitou os cookies.", "GA4", ga4?.atual.contatos ?? 0, ga4?.anterior.contatos ?? 0, ga4?.contatosPorDia ?? {}, faltaGa4),
        indicador("leads", "Pedidos de contato", "Formulários de contato enviados com sucesso. Conta todos, com ou sem cookies.", "Site", soma(leads), leadsAnt, leads),
        indicador("leituras", "Leituras do blog", "Aberturas de post do blog. Conta todas, com ou sem cookies.", "Site", soma(leituras), leiturasAnt, leituras),
    ];

    const origens = ((banco()?.prepare("SELECT origem, SUM(total) AS total FROM lead_dia WHERE dia BETWEEN ? AND ? GROUP BY origem ORDER BY total DESC").all(p.inicio, p.fim) as { origem: string; total: number }[] | undefined) ?? []).map((o) => ({
        origem: ORIGENS[o.origem] ?? o.origem,
        total: o.total,
    }));

    const alertas: Alerta[] = [];
    if (faltaGa4) alertas.push({ tipo: "aviso", texto: `Sem dados do GA4. ${faltaGa4}` });
    if (faltaGsc) alertas.push({ tipo: "aviso", texto: `Sem dados do Search Console. ${faltaGsc}` });
    const batimento = ultimoBatimento();
    if (!batimento || agora.getTime() - Date.parse(batimento.em) > 20 * 60e3) alertas.push({ tipo: "atencao", texto: "O agendador não roda há mais de 20 minutos. Nada agendado vai sair até ele voltar." });
    const comErro = ((banco()?.prepare("SELECT (SELECT COUNT(*) FROM ig_post WHERE status = 'erro') + (SELECT COUNT(*) FROM li_post WHERE status = 'erro') AS n").get() as { n: number } | undefined)?.n ?? 0);
    if (comErro > 0) alertas.push({ tipo: "atencao", texto: `${comErro} ${comErro === 1 ? "publicação parou" : "publicações pararam"} com erro. Veja a fila do Instagram e do LinkedIn.` });
    for (const [tabela, nome] of [["ig_conta", "Instagram"], ["li_conta", "LinkedIn"]] as const) {
        const conta = banco()?.prepare(`SELECT expira_em FROM ${tabela} LIMIT 1`).get() as { expira_em: string } | undefined;
        if (conta && Date.parse(conta.expira_em) - agora.getTime() < 10 * 86400e3) alertas.push({ tipo: "atencao", texto: `O token do ${nome} vence em menos de 10 dias.` });
    }
    for (const i of indicadores) {
        if (!i.indisponivel && i.variacao !== null && i.variacao <= -25 && i.anterior >= 10) alertas.push({ tipo: "atencao", texto: `${i.nome}: queda de ${Math.abs(i.variacao)}% contra os ${dias} dias anteriores.` });
    }
    if (ga4 && ga4.atual.sessoes >= 100 && soma(leads) === 0) alertas.push({ tipo: "atencao", texto: `${ga4.atual.sessoes} visitas no período e nenhum pedido de contato. Vale conferir se o formulário está funcionando.` });

    return {
        periodo: p,
        indicadores,
        alertas,
        funil: ga4 ? [{ nome: "Visitas", valor: ga4.atual.sessoes }, { nome: "Cliques em contato", valor: ga4.atual.contatos }, { nome: "Pedidos de contato", valor: soma(leads) }] : null,
        canais: ga4?.canais ?? [],
        paginas: ga4?.paginas ?? [],
        buscas: gsc?.buscas ?? [],
        posicao: gsc ? { atual: gsc.atual.posicao, anterior: gsc.anterior.posicao } : null,
        origens,
        publicacoes: {
            blog: publicadosEntre("blog_agenda", "quando_utc", p),
            instagram: publicadosEntre("ig_post", "publicado_em", p),
            linkedin: publicadosEntre("li_post", "publicado_em", p),
            stories: soma(porDia("story_clique", "cliques", p.inicio, p.fim)),
        },
        google: { ga4: faltaGa4, gsc: faltaGsc },
    };
}
