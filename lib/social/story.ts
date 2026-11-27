/**
 * Regras puras do link do story. A API do Instagram não coloca adesivo de link, então o story é postado
 * pelo celular e o adesivo aponta para /s/<slug>, que conta o clique e leva para a página certa.
 */

const CAMINHO = /^\/(?!\/)[a-z0-9/-]{0,120}$/;
const SLUG = /^[a-z0-9-]{1,80}$/;

/** Pré-visualizações do Instagram e robôs em geral não contam como clique. */
export function ehRobo(userAgent: string | null): boolean {
    return !userAgent || /facebookexternalhit|facebot|bot|crawler|spider|preview/i.test(userAgent);
}

/**
 * Para onde o story leva. O destino é sempre um caminho do próprio site, nunca um endereço de fora.
 * Ordem: a linha "link:" do roteiro, depois o post do blog de mesmo nome (se já estiver no ar), depois a página inicial.
 */
export function destinoDoStory(dados: { slug: string; link: string; postNoAr: boolean }): string {
    const slug = SLUG.test(dados.slug) ? dados.slug : "";
    const caminho = CAMINHO.test(dados.link) ? dados.link : dados.postNoAr && slug ? `/blog/${slug}` : "/";
    const campanha = slug ? `&utm_campaign=${slug}` : "";
    return `${caminho}?utm_source=instagram&utm_medium=story${campanha}`;
}

/** Dia no horário de Brasília, "AAAA-MM-DD". */
export function diaDeBrasilia(agora = new Date()): string {
    return new Date(agora.getTime() - 3 * 3600e3).toISOString().slice(0, 10);
}
