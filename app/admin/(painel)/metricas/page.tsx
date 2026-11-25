import Link from "next/link";
import { usandoGoogleFalso } from "@/lib/metricas/google";
import { metasFixas, montarPainel } from "@/lib/metricas/painel";
import type { Indicador } from "@/lib/metricas/painel";
import { PERIODOS, diaCurto, inteiro } from "@/lib/metricas/regras";
import { acaoAtualizarMetricas, acaoGravarMetas } from "./acoes";
import { GraficoDiario } from "./grafico";

const cartao = "rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5 md:p-6";
const botaoSimples = "px-4 py-2 rounded-lg text-sm font-semibold border-2 border-[var(--border-color)] hover:border-[var(--primary-color)]";

/** Nomes dos canais do GA4 em português. */
const CANAIS: Record<string, string> = {
    "Organic Search": "Busca (Google e outros)",
    Direct: "Direto (digitou o endereço ou sem origem)",
    "Organic Social": "Redes sociais",
    Referral: "Link em outros sites",
    Email: "E-mail",
    "Paid Search": "Anúncio em busca",
    "Paid Social": "Anúncio em rede social",
    "Organic Video": "Vídeo",
    Unassigned: "Não identificado",
};

function Cartao({ i, dias }: { i: Indicador; dias: number }) {
    const progresso = Math.min(100, Math.round((i.valor / i.meta) * 100));
    return (
        <li className={cartao}>
            <h2 className="text-sm font-semibold text-[var(--text-secondary)]">{i.nome}</h2>
            {i.indisponivel ? (
                <>
                    <p className="text-2xl font-bold mt-3">Sem dados</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-2">{i.indisponivel}</p>
                </>
            ) : (
                <>
                    <p className="text-4xl font-bold mt-2 tabular-nums">{inteiro(i.valor)}</p>
                    <p className="text-sm mt-1">
                        {i.variacao === null ? (
                            <span className="text-[var(--text-secondary)]">Sem base de comparação: o período anterior teve zero.</span>
                        ) : (
                            <>
                                <strong className={i.variacao > 0 ? "text-emerald-500" : i.variacao < 0 ? "text-red-500" : ""}>{i.variacao > 0 ? `Subiu ${i.variacao}%` : i.variacao < 0 ? `Caiu ${Math.abs(i.variacao)}%` : "Igual"}</strong>{" "}
                                <span className="text-[var(--text-secondary)]">
                                    {i.variacao === 0 ? "aos" : "contra os"} {dias} dias anteriores ({inteiro(i.anterior)})
                                </span>
                            </>
                        )}
                    </p>
                    <div className="mt-4">
                        <div className="h-2 rounded-full bg-[var(--bg-primary)] overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progresso} aria-label={`${i.nome}: ${progresso}% da meta`}>
                            <div className="h-full rounded-full bg-[var(--secondary-color)]" style={{ width: `${progresso}%` }} />
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-2">
                            {progresso}% da meta de {inteiro(i.meta)} ({i.metaFixa ? "fixa" : "automática"})
                        </p>
                    </div>
                </>
            )}
            <p className="text-xs text-[var(--text-secondary)] mt-3">
                {i.explicacao} Fonte: {i.fonte}.
            </p>
        </li>
    );
}

function Barras({ itens }: { itens: { nome: string; valor: number }[] }) {
    const maior = Math.max(1, ...itens.map((i) => i.valor));
    return (
        <ul className="space-y-3">
            {itens.map((item) => (
                <li key={item.nome}>
                    <div className="flex justify-between gap-3 text-sm mb-1">
                        <span className="truncate">{item.nome}</span>
                        <span className="tabular-nums font-semibold">{inteiro(item.valor)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--bg-primary)] overflow-hidden">
                        <div className="h-full rounded-full bg-[var(--secondary-color)]" style={{ width: `${Math.max(1, (item.valor / maior) * 100)}%` }} />
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default async function MetricasPage({ searchParams }: { searchParams: Promise<{ dias?: string }> }) {
    const pedido = Number((await searchParams).dias);
    const dias = (PERIODOS as readonly number[]).includes(pedido) ? pedido : 30;
    const painel = await montarPainel(dias);
    const fixas = metasFixas();
    const p = painel.periodo;
    const semDados = "text-sm text-[var(--text-secondary)]";

    return (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Métricas</h1>
                    <p className="text-[var(--text-secondary)]">
                        De {diaCurto(p.inicio)} a {diaCurto(p.fim)}, contra {diaCurto(p.antInicio)} a {diaCurto(p.antFim)}. Só dias completos: hoje fica de fora.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {PERIODOS.map((n) => (
                        <Link key={n} href={`/admin/metricas?dias=${n}`} aria-current={n === dias ? "page" : undefined} className={`${botaoSimples} ${n === dias ? "border-[var(--primary-color)]" : "text-[var(--text-secondary)]"}`}>
                            {n} dias
                        </Link>
                    ))}
                    <form action={acaoAtualizarMetricas}>
                        <button type="submit" className={botaoSimples}>
                            Atualizar agora
                        </button>
                    </form>
                </div>
            </div>

            {usandoGoogleFalso() && (
                <p className="rounded-xl border border-dashed border-amber-500/60 p-4 text-sm text-amber-500">
                    Modo de teste: as visitas e as buscas vêm de uma API falsa do Google nesta máquina, com números inventados. Pedidos de contato e leituras do blog são os reais deste computador.
                </p>
            )}

            {painel.alertas.length > 0 && (
                <section aria-labelledby="titulo-alertas" className={cartao}>
                    <h2 id="titulo-alertas" className="text-xl font-bold mb-3">
                        O que pede atenção
                    </h2>
                    <ul className="space-y-2 text-sm">
                        {painel.alertas.map((a) => (
                            <li key={a.texto} className="flex gap-3">
                                <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold h-fit ${a.tipo === "atencao" ? "bg-red-500/15 text-red-500" : "bg-amber-500/15 text-amber-500"}`}>{a.tipo === "atencao" ? "Atenção" : "Aviso"}</span>
                                <span>{a.texto}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                {painel.indicadores.map((i) => (
                    <Cartao key={i.id} i={i} dias={dias} />
                ))}
            </ul>

            <section className={cartao} aria-labelledby="titulo-diario">
                <h2 id="titulo-diario" className="text-xl font-bold mb-4">
                    Dia a dia
                </h2>
                <GraficoDiario series={painel.indicadores.map((i) => ({ id: i.id, nome: i.nome, indisponivel: i.indisponivel, serie: i.serie }))} />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section className={cartao} aria-labelledby="titulo-funil">
                    <h2 id="titulo-funil" className="text-xl font-bold mb-1">
                        Do acesso ao contato
                    </h2>
                    {painel.funil ? (
                        <>
                            <p className="text-sm text-[var(--text-secondary)] mb-4">
                                De cada 100 visitas, {painel.funil[0].valor > 0 ? ((painel.funil[2].valor / painel.funil[0].valor) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) : "0"} viraram pedido de contato.
                            </p>
                            <Barras itens={painel.funil} />
                            <p className="text-xs text-[var(--text-secondary)] mt-4">Visitas e cliques só contam quem aceitou os cookies; pedidos de contato contam todos. Por isso a proporção real é um pouco menor.</p>
                        </>
                    ) : (
                        <p className={semDados}>Sem dados do GA4 para montar o funil.</p>
                    )}
                </section>

                <section className={cartao} aria-labelledby="titulo-canais">
                    <h2 id="titulo-canais" className="text-xl font-bold mb-4">
                        De onde vêm as visitas
                    </h2>
                    {painel.canais.length > 0 ? <Barras itens={painel.canais.map((c) => ({ nome: CANAIS[c.nome] ?? c.nome, valor: c.sessoes }))} /> : <p className={semDados}>Sem dados do GA4.</p>}
                </section>

                <section className={cartao} aria-labelledby="titulo-paginas">
                    <h2 id="titulo-paginas" className="text-xl font-bold mb-4">
                        Páginas mais vistas
                    </h2>
                    {painel.paginas.length > 0 ? <Barras itens={painel.paginas.map((c) => ({ nome: c.caminho, valor: c.visualizacoes }))} /> : <p className={semDados}>Sem dados do GA4.</p>}
                </section>

                <section className={cartao} aria-labelledby="titulo-buscas">
                    <h2 id="titulo-buscas" className="text-xl font-bold mb-1">
                        Buscas no Google que trouxeram clique
                    </h2>
                    {painel.buscas.length > 0 ? (
                        <>
                            {painel.posicao && (
                                <p className="text-sm text-[var(--text-secondary)] mb-4">
                                    Posição média: {painel.posicao.atual.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} (antes, {painel.posicao.anterior.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}). Quanto menor, melhor. O Search
                                    Console atrasa de 2 a 3 dias.
                                </p>
                            )}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-[var(--text-secondary)]">
                                            <th scope="col" className="py-1 pr-3 font-semibold">
                                                Busca
                                            </th>
                                            <th scope="col" className="py-1 px-2 font-semibold text-right">
                                                Cliques
                                            </th>
                                            <th scope="col" className="py-1 px-2 font-semibold text-right">
                                                Apareceu
                                            </th>
                                            <th scope="col" className="py-1 pl-2 font-semibold text-right">
                                                Posição
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {painel.buscas.map((b) => (
                                            <tr key={b.termo} className="border-t border-[var(--border-color)]">
                                                <td className="py-1.5 pr-3">{b.termo}</td>
                                                <td className="py-1.5 px-2 text-right tabular-nums">{inteiro(b.cliques)}</td>
                                                <td className="py-1.5 px-2 text-right tabular-nums">{inteiro(b.impressoes)}</td>
                                                <td className="py-1.5 pl-2 text-right tabular-nums">{b.posicao.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <p className={`${semDados} mt-3`}>Sem dados do Search Console.</p>
                    )}
                </section>

                <section className={cartao} aria-labelledby="titulo-origens">
                    <h2 id="titulo-origens" className="text-xl font-bold mb-1">
                        Como quem pediu contato conheceu a Rugemtugem
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">É a resposta que a pessoa marca no formulário.</p>
                    {painel.origens.length > 0 ? <Barras itens={painel.origens.map((o) => ({ nome: o.origem, valor: o.total }))} /> : <p className={semDados}>Nenhum pedido de contato no período.</p>}
                </section>

                <section className={cartao} aria-labelledby="titulo-publicacoes">
                    <h2 id="titulo-publicacoes" className="text-xl font-bold mb-4">
                        O que saiu no período
                    </h2>
                    <dl className="grid grid-cols-2 gap-4">
                        {[
                            ["Posts no blog", painel.publicacoes.blog],
                            ["Publicações no Instagram", painel.publicacoes.instagram],
                            ["Posts no LinkedIn", painel.publicacoes.linkedin],
                            ["Cliques em link de story", painel.publicacoes.stories],
                        ].map(([nome, valor]) => (
                            <div key={nome}>
                                <dt className="text-sm text-[var(--text-secondary)]">{nome}</dt>
                                <dd className="text-3xl font-bold tabular-nums">{inteiro(Number(valor))}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            </div>

            <details className={cartao}>
                <summary className="text-lg font-bold cursor-pointer">Metas</summary>
                <p className="text-sm text-[var(--text-secondary)] mt-3 mb-4">
                    Sem meta fixa, o painel calcula sozinho: o maior entre 15% acima do período anterior e o ritmo dos últimos 7 dias mais 10%. Para fixar, escreva a meta para 30 dias; nos outros períodos ela vale na proporção. Vazio volta para a
                    automática.
                </p>
                <form action={acaoGravarMetas} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    {painel.indicadores.map((i) => (
                        <div key={i.id}>
                            <label htmlFor={`meta-${i.id}`} className="block text-sm font-semibold mb-1">
                                {i.nome}
                            </label>
                            <input
                                id={`meta-${i.id}`}
                                name={i.id}
                                type="number"
                                min={0}
                                inputMode="numeric"
                                defaultValue={fixas[i.id] ?? ""}
                                placeholder="automática"
                                className="w-full px-3 py-2.5 rounded-lg bg-[var(--bg-primary)] border-2 border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary-color)]"
                            />
                        </div>
                    ))}
                    <button type="submit" className="sm:col-span-2 lg:col-span-5 justify-self-start px-5 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">
                        Gravar metas
                    </button>
                </form>
            </details>
        </div>
    );
}
