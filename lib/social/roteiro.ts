/**
 * Roteiro do Instagram: lê o arquivo content/social/<slug>.md e aponta o que impede a publicação.
 * Regras puras, sem banco nem disco, para poderem ser testadas direto.
 *
 * Formato do arquivo:
 *
 *   tema: Pedido do WhatsApp direto no ERP
 *   categoria: Empresas
 *   agendar: 2026-12-02 12:00
 *   link: /servicos/integracao-whatsapp-erp
 *
 *   ## capa
 *   titulo: O pedido chega no WhatsApp e alguém [digita tudo de novo]?
 *   nota: Frase curta de apoio
 *
 *   ## pontos
 *   titulo: Onde o tempo some
 *   - Primeira linha
 *   - Segunda linha
 *
 *   ## numero
 *   valor: 7.170
 *   titulo: O que o número mede
 *   fonte: De onde o número saiu
 *
 *   ## duo
 *   titulo: O que muda
 *   antes: Como é hoje
 *   depois: Como fica
 *
 *   ## cta
 *   titulo: Pergunta final
 *   nota: Frase de apoio
 *
 *   ## legenda
 *   Texto da legenda, com as hashtags no fim.
 *
 *   ## linkedin
 *   Texto do post do LinkedIn (opcional). {link} vira o endereço da página, já marcado para a medição.
 *
 * Colchetes no título marcam o trecho em destaque. A linha "link:" é opcional: é para onde o adesivo do story leva
 * (um caminho do próprio site). Sem ela, o story leva ao post do blog de mesmo nome, ou à página inicial.
 */

export const TIPOS_DE_SLIDE = ["capa", "pontos", "numero", "duo", "cta"] as const;
export type TipoDeSlide = (typeof TIPOS_DE_SLIDE)[number];

export interface Slide {
    tipo: string;
    titulo: string;
    nota: string;
    valor: string;
    fonte: string;
    antes: string;
    depois: string;
    botao: string;
    linhas: string[];
}

export interface Roteiro {
    tema: string;
    categoria: string;
    /** "AAAA-MM-DD HH:MM" no horário de Brasília, ou vazio. */
    agendar: string;
    /** Caminho do próprio site para o adesivo do story, ou vazio. */
    link: string;
    slides: Slide[];
    legenda: string;
    /** Texto do post do LinkedIn, ou vazio se o roteiro não vai para lá. */
    linkedin: string;
}

const CAMPOS_DO_SLIDE = ["titulo", "nota", "valor", "fonte", "antes", "depois", "botao"] as const;
const TRAVESSOES = [String.fromCharCode(0x2014), String.fromCharCode(0x2013)];

function slideVazio(tipo: string): Slide {
    return { tipo, titulo: "", nota: "", valor: "", fonte: "", antes: "", depois: "", botao: "", linhas: [] };
}

export function lerRoteiro(md: string): Roteiro {
    const roteiro: Roteiro = { tema: "", categoria: "", agendar: "", link: "", slides: [], legenda: "", linkedin: "" };
    const blocos: Record<"legenda" | "linkedin", string[]> = { legenda: [], linkedin: [] };
    let bloco: "legenda" | "linkedin" | null = null;
    let atual: Slide | null = null;
    let noCabecalho = true;

    for (const bruta of md.replace(/\r/g, "").split("\n")) {
        const linha = bruta.trim();
        const secao = linha.match(/^##\s+([\p{L}-]+)\s*$/u);
        if (secao) {
            noCabecalho = false;
            const nome = secao[1].toLowerCase();
            bloco = nome === "legenda" || nome === "linkedin" ? nome : null;
            atual = bloco ? null : slideVazio(nome);
            if (atual) roteiro.slides.push(atual);
            continue;
        }
        if (bloco) {
            blocos[bloco].push(bruta.trimEnd());
            continue;
        }
        if (noCabecalho) {
            const par = linha.match(/^(tema|categoria|agendar|link)\s*:\s*(.+)$/i);
            if (par) roteiro[par[1].toLowerCase() as "tema" | "categoria" | "agendar" | "link"] = par[2].trim();
            continue;
        }
        if (!atual || linha === "") continue;
        const campo = linha.match(/^([a-z]+)\s*:\s*(.*)$/i);
        if (campo && (CAMPOS_DO_SLIDE as readonly string[]).includes(campo[1].toLowerCase())) {
            atual[campo[1].toLowerCase() as (typeof CAMPOS_DO_SLIDE)[number]] = campo[2].trim();
        } else {
            atual.linhas.push(linha.replace(/^[-*]\s+/, ""));
        }
    }
    roteiro.legenda = blocos.legenda.join("\n").trim();
    roteiro.linkedin = blocos.linkedin.join("\n").trim();
    return roteiro;
}

/** Separa o título em palavras, marcando as que estão entre colchetes. */
export function palavrasDoTitulo(titulo: string): { texto: string; destaque: boolean }[] {
    const palavras: { texto: string; destaque: boolean }[] = [];
    let destaque = false;
    let fechouAgora = false;
    for (const pedaco of titulo.split(/(\[|\])/)) {
        if (pedaco === "[") destaque = true;
        else if (pedaco === "]") {
            destaque = false;
            fechouAgora = true;
            continue;
        } else {
            let resto = pedaco;
            // Pontuação colada no fim do destaque ("[perde tempo]?") fica na mesma palavra, sem espaço antes.
            const colado = fechouAgora && palavras.length > 0 ? resto.match(/^[^\s]+/) : null;
            if (colado) {
                palavras[palavras.length - 1].texto += colado[0];
                resto = resto.slice(colado[0].length);
            }
            for (const texto of resto.split(/\s+/).filter(Boolean)) palavras.push({ texto, destaque });
        }
        fechouAgora = false;
    }
    return palavras;
}

/** Caminho interno aceito como destino de link: nunca um endereço de fora. */
export const CAMINHO_DO_SITE = /^\/(?!\/)[a-z0-9/-]{0,120}$/;

const semColchetes = (texto: string) => texto.replace(/[[\]]/g, "");

/** Problemas que impedem gerar e agendar o carrossel. Lista vazia quer dizer que está tudo certo. */
export function problemasDoRoteiro(roteiro: Roteiro): string[] {
    const problemas: string[] = [];
    const total = roteiro.slides.length;
    if (!roteiro.tema) problemas.push("Falta a linha \"tema:\" no começo do arquivo.");
    if (roteiro.agendar && !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(roteiro.agendar)) problemas.push("A linha \"agendar:\" precisa estar no formato AAAA-MM-DD HH:MM.");
    if (roteiro.link && !CAMINHO_DO_SITE.test(roteiro.link)) problemas.push("A linha \"link:\" precisa ser um caminho do próprio site, como /servicos ou /blog/nome-do-post.");
    if (total < 2 || total > 10) problemas.push(`O carrossel precisa de 2 a 10 slides (o arquivo tem ${total}).`);
    if (total > 0 && roteiro.slides[0].tipo !== "capa") problemas.push("O primeiro slide precisa ser a capa.");
    if (total > 1 && roteiro.slides[total - 1].tipo !== "cta") problemas.push("O último slide precisa ser o convite (cta).");
    if (!roteiro.legenda) problemas.push("Falta a seção da legenda.");

    roteiro.slides.forEach((slide, i) => {
        const n = `Slide ${i + 1}`;
        if (!(TIPOS_DE_SLIDE as readonly string[]).includes(slide.tipo)) {
            problemas.push(`${n}: tipo "${slide.tipo}" não existe. Use capa, pontos, numero, duo ou cta.`);
            return;
        }
        const titulo = semColchetes(slide.titulo);
        if (!titulo) problemas.push(`${n}: falta o título.`);
        if (titulo.length > 110) problemas.push(`${n}: título com ${titulo.length} caracteres. O limite é 110.`);
        if (slide.nota.length > 140) problemas.push(`${n}: nota com ${slide.nota.length} caracteres. O limite é 140.`);
        if (slide.tipo === "pontos") {
            if (slide.linhas.length < 1 || slide.linhas.length > 4) problemas.push(`${n}: use de 1 a 4 linhas (tem ${slide.linhas.length}).`);
            slide.linhas.forEach((l) => {
                if (l.length > 95) problemas.push(`${n}: a linha "${l.slice(0, 30)}..." tem ${l.length} caracteres. O limite é 95.`);
            });
        }
        if (slide.tipo === "numero") {
            if (!slide.valor) problemas.push(`${n}: falta o valor.`);
            if (slide.valor.length > 10) problemas.push(`${n}: o valor "${slide.valor}" não cabe. Use até 10 caracteres.`);
            if (!slide.fonte) problemas.push(`${n}: todo número publicado precisa de fonte. Preencha a linha "fonte:".`);
        }
        if (slide.tipo === "duo") {
            if (!slide.antes || !slide.depois) problemas.push(`${n}: preencha as linhas "antes:" e "depois:".`);
            if (slide.antes.length > 120 || slide.depois.length > 120) problemas.push(`${n}: "antes" e "depois" têm limite de 120 caracteres cada.`);
        }
        const tudo = [slide.titulo, slide.nota, slide.valor, slide.fonte, slide.antes, slide.depois, slide.botao, ...slide.linhas].join(" ");
        if (TRAVESSOES.some((t) => tudo.includes(t))) problemas.push(`${n}: tem travessão. Troque por vírgula, ponto ou dois-pontos.`);
        if (/ferrugem/i.test(tudo)) problemas.push(`${n}: o apelido não entra em peça publicada.`);
    });
    return problemas;
}
