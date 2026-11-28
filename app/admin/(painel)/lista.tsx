import Link from "next/link";
import { enderecoDaLista } from "@/lib/admin/lista";
import type { Parametros, PedidoDaLista, ResultadoDaLista } from "@/lib/admin/lista";

/**
 * Busca, filtros e paginação das listas do painel. Funciona sem JavaScript: a busca é um formulário GET e os
 * filtros e as páginas são links. O estado fica no endereço, então recarregar ou voltar mantém onde a pessoa estava.
 */

interface Comum {
    /** Caminho da tela, como "/admin/instagram". */
    base: string;
    /** Prefixo dos parâmetros desta lista no endereço. */
    prefixo: string;
    /** Parâmetros atuais da tela, para manter o estado das outras listas. */
    parametros: Parametros;
    /** id do bloco da lista: os links voltam para ele, em vez do topo da tela. */
    ancora: string;
}

const alvo = "inline-flex items-center justify-center min-h-11 px-4 rounded-lg text-sm font-semibold border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-color)]";

export function ControlesDaLista<T>({
    base,
    prefixo,
    parametros,
    ancora,
    pedido,
    resultado,
    filtros,
    oQue,
    rotuloDaBusca,
}: Comum & {
    pedido: PedidoDaLista;
    resultado: ResultadoDaLista<T>;
    /** Opções de filtro, na ordem em que aparecem: [valor, nome]. */
    filtros: [string, string][];
    /** Nome do item no plural, para a contagem: "posts", "publicações". */
    oQue: string;
    rotuloDaBusca: string;
}) {
    // Com poucos itens e nada filtrado, os controles só ocupariam espaço.
    const ativo = Boolean(pedido.busca || pedido.filtro);
    if (resultado.total <= 5 && !ativo) return null;
    const idDaBusca = `busca-${ancora}`;
    const outros = Object.entries(parametros).filter(([chave, valor]) => valor && ![`${prefixo}q`, `${prefixo}p`].includes(chave));

    return (
        <div className="mb-4 space-y-3">
            <form method="get" action={`${base}#${ancora}`} role="search" className="flex flex-col sm:flex-row sm:items-end gap-3">
                {outros.map(([chave, valor]) => (
                    <input key={chave} type="hidden" name={chave} value={Array.isArray(valor) ? valor[0] : valor} />
                ))}
                <div className="flex-1 min-w-0">
                    <label htmlFor={idDaBusca} className="block text-sm font-semibold mb-1.5">
                        {rotuloDaBusca}
                    </label>
                    <input
                        id={idDaBusca}
                        name={`${prefixo}q`}
                        type="search"
                        defaultValue={pedido.busca}
                        maxLength={80}
                        autoComplete="off"
                        enterKeyHint="search"
                        className="w-full min-h-11 px-4 rounded-lg border-2 border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:outline-none"
                    />
                </div>
                <button type="submit" className={`${alvo} border-transparent text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] hover:opacity-90`}>
                    Buscar
                </button>
                {ativo && (
                    <Link href={enderecoDaLista(base, parametros, prefixo, { busca: "", filtro: "" }, ancora)} scroll={false} className={`${alvo} border-[var(--border-color)] hover:border-[var(--primary-color)]`}>
                        Limpar
                    </Link>
                )}
            </form>

            {filtros.length > 0 && (
                <ul className="flex flex-wrap gap-2" aria-label="Filtrar por situação">
                    {[["", "Todos"] as [string, string], ...filtros].map(([valor, nome]) => {
                        const quantos = resultado.contagens[valor] ?? 0;
                        const atual = pedido.filtro === valor;
                        // Filtro sem nenhum item some, a não ser que seja o que está ligado.
                        if (valor && quantos === 0 && !atual) return null;
                        return (
                            <li key={valor || "todos"}>
                                <Link
                                    href={enderecoDaLista(base, parametros, prefixo, { filtro: valor }, ancora)}
                                    scroll={false}
                                    aria-current={atual ? "true" : undefined}
                                    className={`${alvo} ${atual ? "border-[var(--primary-color)] bg-[var(--primary-color)]/10" : "border-[var(--border-color)] hover:border-[var(--primary-color)]"}`}
                                >
                                    {nome}
                                    <span className="ml-2 text-xs font-normal text-[var(--text-secondary)]">{quantos}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}

            <p className="text-sm text-[var(--text-secondary)]" role="status">
                {resultado.encontrados === 0
                    ? `Nenhum resultado em ${resultado.total} ${oQue}.`
                    : ativo
                      ? `${resultado.encontrados} de ${resultado.total} ${oQue}.`
                      : `${resultado.total} ${oQue}.`}
            </p>
        </div>
    );
}

/** Aviso de lista vazia depois da busca, com o caminho de volta. */
export function SemResultado({ base, prefixo, parametros, ancora, pedido }: Comum & { pedido: PedidoDaLista }) {
    return (
        <div className="rounded-xl border border-dashed border-[var(--border-color)] p-6 text-sm">
            <p className="font-semibold mb-1">{pedido.busca ? `Nada encontrado para “${pedido.busca}”.` : "Nada nesta situação."}</p>
            <p className="text-[var(--text-secondary)] mb-4">{pedido.busca ? "Tente uma palavra só do título, sem acento ou no singular." : "Escolha outra situação ou veja todos."}</p>
            <Link href={enderecoDaLista(base, parametros, prefixo, { busca: "", filtro: "" }, ancora)} scroll={false} className={`${alvo} border-[var(--border-color)] hover:border-[var(--primary-color)]`}>
                Ver todos
            </Link>
        </div>
    );
}

export function Paginacao<T>({ base, prefixo, parametros, ancora, resultado, oQue }: Comum & { resultado: ResultadoDaLista<T>; oQue: string }) {
    if (resultado.paginas <= 1) return null;
    const { pagina, paginas } = resultado;
    const link = (para: number, texto: string, rotulo: string) =>
        para < 1 || para > paginas ? (
            <span aria-disabled="true" className={`${alvo} border-[var(--border-color)] opacity-40`}>
                {texto}
            </span>
        ) : (
            <Link href={enderecoDaLista(base, parametros, prefixo, { pagina: para }, ancora)} aria-label={rotulo} className={`${alvo} border-[var(--border-color)] hover:border-[var(--primary-color)]`}>
                {texto}
            </Link>
        );
    return (
        <nav aria-label={`Páginas de ${oQue}`} className="mt-5 flex items-center justify-between gap-3">
            {link(pagina - 1, "Anterior", `Página anterior de ${oQue}`)}
            <p className="text-sm text-[var(--text-secondary)]" aria-current="page">
                Página {pagina} de {paginas}
            </p>
            {link(pagina + 1, "Próxima", `Próxima página de ${oQue}`)}
        </nav>
    );
}
