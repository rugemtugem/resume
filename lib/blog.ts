import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Blog em arquivos de texto, no formato do blog do Calcula Trabalhador:
 * título na primeira linha, metadados em linhas "> Chave: valor", resumo, corpo e perguntas frequentes.
 * Quando a Agenda existir, a regra de publicação passa a vir dela.
 */

const PASTA = join(process.cwd(), "content", "blog");

export type CategoriaId = "empresas" | "ia";

export const CATEGORIAS: Record<CategoriaId, { nome: string; texto: string }> = {
    empresas: { nome: "Para empresas", texto: "Casos reais e explicações diretas sobre ligar site, WhatsApp e sistemas." },
    ia: { nome: "Dicas de IA", texto: "Como eu uso IA para construir e operar sistemas de verdade." },
};

export interface Pergunta {
    pergunta: string;
    resposta: string;
}

export interface Post {
    slug: string;
    titulo: string;
    tituloSeo: string;
    descricao: string;
    categoria: CategoriaId;
    resumo: string;
    resumoHtml: string;
    html: string;
    indice: { id: string; texto: string }[];
    perguntas: Pergunta[];
    minutos: number;
    /** Data e hora de publicação, em ISO (UTC). */
    publicadoEm: string;
    rascunho: boolean;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s: string) => esc(s).replace(/"/g, "&quot;");
const idDeTitulo = (s: string) =>
    s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

const semMarcacao = (s: string) =>
    s
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/(\*\*|_)([^*_]+)\1/g, "$2")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\s+/g, " ")
        .trim();

function emLinha(s: string): string {
    let t = esc(s);
    t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
    t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, txt: string, href: string) => {
        const externo = /^https?:/.test(href);
        return `<a href="${escAttr(href)}"${externo ? ' target="_blank" rel="noopener noreferrer"' : ""}>${txt}</a>`;
    });
    t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    t = t.replace(/(^|[\s(])_([^_]+)_/g, "$1<em>$2</em>");
    return t;
}

function corpo(linhas: string[]) {
    const saida: string[] = [];
    const indice: { id: string; texto: string }[] = [];
    let paragrafo: string[] = [];
    let lista: string[] | null = null;
    let palavras = 0;

    const fechaParagrafo = () => {
        if (!paragrafo.length) return;
        const txt = paragrafo.join(" ");
        palavras += txt.split(/\s+/).length;
        saida.push(`<p>${emLinha(txt)}</p>`);
        paragrafo = [];
    };
    const fechaLista = () => {
        if (lista) saida.push(`<ul>${lista.join("")}</ul>`);
        lista = null;
    };

    for (const bruta of linhas) {
        const linha = bruta.trim();
        if (linha === "") {
            fechaParagrafo();
            fechaLista();
            continue;
        }
        let m: RegExpMatchArray | null;
        if ((m = linha.match(/^###\s+(.+)/))) {
            fechaParagrafo();
            fechaLista();
            saida.push(`<h3 id="${idDeTitulo(m[1])}">${emLinha(m[1])}</h3>`);
        } else if ((m = linha.match(/^##\s+(.+)/))) {
            fechaParagrafo();
            fechaLista();
            const id = idDeTitulo(m[1]);
            indice.push({ id, texto: semMarcacao(m[1]) });
            saida.push(`<h2 id="${id}">${emLinha(m[1])}</h2>`);
        } else if ((m = linha.match(/^!\[(.*?)\]\((.+?)\)/))) {
            fechaParagrafo();
            fechaLista();
            saida.push(`<figure><img src="${escAttr(m[2])}" alt="${escAttr(m[1])}" loading="lazy" decoding="async"></figure>`);
        } else if ((m = linha.match(/^-\s+(.+)/))) {
            fechaParagrafo();
            lista = lista || [];
            palavras += m[1].split(/\s+/).length;
            lista.push(`<li>${emLinha(m[1])}</li>`);
        } else {
            fechaLista();
            paragrafo.push(linha);
        }
    }
    fechaParagrafo();
    fechaLista();
    return { html: saida.join("\n"), indice, palavras };
}

function perguntas(linhas: string[]): Pergunta[] {
    const lista: Pergunta[] = [];
    let atual: Pergunta | null = null;
    for (const bruta of linhas) {
        const linha = bruta.trim();
        const m = linha.match(/^###\s+(.+)/);
        if (m) {
            if (atual) lista.push(atual);
            atual = { pergunta: semMarcacao(m[1]), resposta: "" };
        } else if (atual && linha) {
            atual.resposta = (atual.resposta + " " + semMarcacao(linha)).trim();
        }
    }
    if (atual) lista.push(atual);
    return lista.filter((p) => p.resposta);
}

const meta = (bruto: string, chave: string) => (bruto.match(new RegExp(`^>\\s*${chave}:\\s*(.+?)\\s*$`, "m")) || [])[1]?.trim() ?? "";

/** "2026-12-02 09:00" em horário de Brasília vira ISO em UTC. */
function agendamento(valor: string): string | null {
    const m = valor.match(/^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2}))?$/);
    if (!m) return null;
    const [, ano, mes, dia, hora = "09", minuto = "00"] = m;
    return new Date(Date.UTC(+ano, +mes - 1, +dia, +hora + 3, +minuto)).toISOString();
}

function lerPost(arquivo: string): Post | null {
    const bruto = readFileSync(join(PASTA, arquivo), "utf8");
    const linhas = bruto.split("\n");
    const titulo = (linhas.find((l) => /^#\s+/.test(l)) || "").replace(/^#\s+/, "").trim();
    const categoriaM = bruto.match(/^>\s*Categoria:\s*(.+?)\s*·\s*slug:\s*(.+?)\s*$/m);
    const publicadoEm = agendamento(meta(bruto, "Agendar"));
    if (!titulo || !categoriaM || !publicadoEm) return null;

    const categoria: CategoriaId = /^ia$/i.test(categoriaM[1].trim()) ? "ia" : "empresas";
    const resumoBruto = (bruto.match(/^\*\*Resumo:\*\*\s*([\s\S]+?)\n\s*\n/m) || ["", ""])[1].replace(/\n/g, " ").trim();

    const inicioPerguntas = linhas.findIndex((l) => /^##\s+Perguntas frequentes/i.test(l.trim()));
    const linhasDoCorpo = linhas
        .slice(0, inicioPerguntas === -1 ? linhas.length : inicioPerguntas)
        .filter((l) => {
            const t = l.trim();
            return !/^#\s+/.test(t) && !/^>\s*(Categoria|SEO|DESC|Agendar|Rascunho|CAPA|Publicado):/.test(t) && !/^\*\*Resumo:\*\*/.test(t);
        });
    const { html, indice, palavras } = corpo(linhasDoCorpo);

    return {
        slug: categoriaM[2].trim(),
        titulo,
        tituloSeo: meta(bruto, "SEO") || titulo,
        descricao: meta(bruto, "DESC"),
        categoria,
        resumo: semMarcacao(resumoBruto),
        resumoHtml: emLinha(resumoBruto),
        html,
        indice,
        perguntas: inicioPerguntas === -1 ? [] : perguntas(linhas.slice(inicioPerguntas + 1)),
        minutos: Math.max(2, Math.round(palavras / 200)),
        publicadoEm,
        rascunho: /^sim$/i.test(meta(bruto, "Rascunho")),
    };
}

/** Posts que podem aparecer agora: data vencida e, no ar, sem a marca de rascunho. */
export function postsPublicados(): Post[] {
    if (!existsSync(PASTA)) return [];
    const agora = Date.now();
    const noAr = process.env.NODE_ENV === "production";
    return readdirSync(PASTA)
        .filter((arquivo) => /^[a-z0-9].*\.md$/.test(arquivo))
        .map(lerPost)
        .filter((post): post is Post => post !== null)
        .filter((post) => Date.parse(post.publicadoEm) <= agora && !(noAr && post.rascunho))
        .sort((a, b) => b.publicadoEm.localeCompare(a.publicadoEm));
}

export function postPorSlug(slug: string): Post | undefined {
    return postsPublicados().find((post) => post.slug === slug);
}

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

/** Data por extenso no dia de Brasília. */
export function dataPorExtenso(iso: string): string {
    const d = new Date(Date.parse(iso) - 3 * 3600e3);
    return `${d.getUTCDate()} de ${MESES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}
