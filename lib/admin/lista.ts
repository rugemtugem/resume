/**
 * Busca, filtro e paginação das listas do painel. Tudo fica no endereço (?aq=...&af=...&ap=2), então a tela
 * pode ser recarregada, guardada nos favoritos ou aberta no celular no mesmo ponto. Cada lista tem um prefixo
 * próprio, para duas listas na mesma página não mexerem uma na outra.
 */

export type Parametros = Record<string, string | string[] | undefined>;

export interface PedidoDaLista {
    busca: string;
    filtro: string;
    pagina: number;
}

export interface ResultadoDaLista<T> {
    itens: T[];
    /** Quantos itens a lista tem ao todo. */
    total: number;
    /** Quantos sobraram depois da busca e do filtro. */
    encontrados: number;
    pagina: number;
    paginas: number;
    /** Quantos itens cada filtro tem, já considerando a busca. A chave "" é o total da busca. */
    contagens: Record<string, number>;
}

/** Minúsculas e sem acento, para "automacao" achar "Automação". */
export function semAcento(texto: string): string {
    return texto
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase();
}

const um = (valor: string | string[] | undefined): string => (Array.isArray(valor) ? valor[0] : valor) ?? "";

export function lerPedido(parametros: Parametros, prefixo: string): PedidoDaLista {
    const pagina = Number(um(parametros[`${prefixo}p`]));
    return {
        busca: um(parametros[`${prefixo}q`]).trim().slice(0, 80),
        filtro: um(parametros[`${prefixo}f`]).trim().slice(0, 40),
        pagina: Number.isInteger(pagina) && pagina > 0 ? pagina : 1,
    };
}

export function filtrarEPaginar<T>(todos: T[], pedido: PedidoDaLista, regras: { texto: (item: T) => string; grupo: (item: T) => string; porPagina: number }): ResultadoDaLista<T> {
    // Todas as palavras da busca precisam aparecer, em qualquer ordem.
    const palavras = semAcento(pedido.busca).split(/\s+/).filter(Boolean);
    const daBusca = palavras.length === 0 ? todos : todos.filter((item) => palavras.every((p) => semAcento(regras.texto(item)).includes(p)));

    const contagens: Record<string, number> = { "": daBusca.length };
    for (const item of daBusca) {
        const g = regras.grupo(item);
        contagens[g] = (contagens[g] ?? 0) + 1;
    }

    const filtrados = pedido.filtro ? daBusca.filter((item) => regras.grupo(item) === pedido.filtro) : daBusca;
    const paginas = Math.max(1, Math.ceil(filtrados.length / regras.porPagina));
    // Página pedida além do fim (lista encolheu, endereço antigo): mostra a última, em vez de uma tela vazia.
    const pagina = Math.min(pedido.pagina, paginas);
    return { itens: filtrados.slice((pagina - 1) * regras.porPagina, pagina * regras.porPagina), total: todos.length, encontrados: filtrados.length, pagina, paginas, contagens };
}

/**
 * Endereço da mesma tela com a lista em outro estado. Os parâmetros das outras listas são mantidos;
 * valor vazio ou página 1 saem do endereço, para ele ficar curto.
 */
export function enderecoDaLista(base: string, parametros: Parametros, prefixo: string, mudancas: Partial<{ busca: string; filtro: string; pagina: number }>, ancora = ""): string {
    const consulta = new URLSearchParams();
    for (const [chave, valor] of Object.entries(parametros)) {
        const v = um(valor);
        if (v) consulta.set(chave, v);
    }
    const por = (chave: string, valor: string) => (valor ? consulta.set(prefixo + chave, valor) : consulta.delete(prefixo + chave));
    if (mudancas.busca !== undefined) por("q", mudancas.busca);
    if (mudancas.filtro !== undefined) por("f", mudancas.filtro);
    // Mudar a busca ou o filtro volta para a primeira página.
    const pagina = mudancas.pagina ?? (mudancas.busca !== undefined || mudancas.filtro !== undefined ? 1 : Number(consulta.get(`${prefixo}p`)) || 1);
    por("p", pagina > 1 ? String(pagina) : "");
    const texto = consulta.toString();
    return `${base}${texto ? `?${texto}` : ""}${ancora ? `#${ancora}` : ""}`;
}
