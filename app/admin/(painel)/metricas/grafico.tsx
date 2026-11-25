"use client";

import { useState } from "react";
import type { PointerEvent } from "react";

interface Serie {
    id: string;
    nome: string;
    indisponivel: string;
    serie: { dia: string; valor: number }[];
}

const L = 720;
const A = 260;
const M = { topo: 16, direita: 16, base: 30, esquerda: 44 };
const diaCurto = (dia: string) => `${dia.slice(8, 10)}/${dia.slice(5, 7)}`;
const inteiro = (n: number) => n.toLocaleString("pt-BR");

/** Teto "redondo" do eixo, para as linhas de grade caírem em números fáceis de ler. */
function teto(maximo: number): number {
    if (maximo <= 4) return 4;
    const potencia = 10 ** Math.floor(Math.log10(maximo));
    for (const passo of [1, 2, 4, 5, 10]) if (maximo <= passo * potencia) return passo * potencia;
    return 10 * potencia;
}

/** Série diária de um indicador por vez: uma linha, um eixo, com leitura por dia ao passar o mouse e tabela. */
export function GraficoDiario({ series }: { series: Serie[] }) {
    const [escolhido, setEscolhido] = useState(series[0]?.id ?? "");
    const [foco, setFoco] = useState<number | null>(null);
    const atual = series.find((s) => s.id === escolhido) ?? series[0];
    if (!atual) return null;

    const pontos = atual.serie;
    const maximo = teto(Math.max(1, ...pontos.map((p) => p.valor)));
    const larguraUtil = L - M.esquerda - M.direita;
    const alturaUtil = A - M.topo - M.base;
    const x = (i: number) => M.esquerda + (pontos.length > 1 ? (i / (pontos.length - 1)) * larguraUtil : larguraUtil / 2);
    const y = (v: number) => M.topo + alturaUtil - (v / maximo) * alturaUtil;
    const caminho = pontos.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.valor).toFixed(1)}`).join(" ");
    const rotulos = pontos.length > 2 ? [0, Math.floor((pontos.length - 1) / 2), pontos.length - 1] : pontos.map((_, i) => i);

    function aoMover(evento: PointerEvent<SVGSVGElement>) {
        const caixa = evento.currentTarget.getBoundingClientRect();
        const posicao = ((evento.clientX - caixa.left) / caixa.width) * L;
        const i = Math.round(((posicao - M.esquerda) / larguraUtil) * (pontos.length - 1));
        setFoco(Math.max(0, Math.min(pontos.length - 1, i)));
    }

    return (
        <div>
            <div role="tablist" aria-label="Indicador do gráfico" className="flex flex-wrap gap-2 mb-4">
                {series.map((s) => (
                    <button
                        key={s.id}
                        type="button"
                        role="tab"
                        aria-selected={s.id === atual.id}
                        onClick={() => {
                            setEscolhido(s.id);
                            setFoco(null);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 ${s.id === atual.id ? "border-[var(--primary-color)] text-[var(--text-primary)]" : "border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--primary-color)]"}`}
                    >
                        {s.nome}
                    </button>
                ))}
            </div>

            {atual.indisponivel ? (
                <p className="text-sm text-[var(--text-secondary)] py-10 text-center">Sem dados para o gráfico. {atual.indisponivel}</p>
            ) : (
                <>
                    <div className="relative">
                        <svg viewBox={`0 0 ${L} ${A}`} role="img" aria-label={`${atual.nome} por dia, de ${diaCurto(pontos[0].dia)} a ${diaCurto(pontos[pontos.length - 1].dia)}`} className="w-full h-auto touch-none" onPointerMove={aoMover} onPointerLeave={() => setFoco(null)}>
                            {[0, 0.5, 1].map((fracao) => (
                                <g key={fracao}>
                                    <line x1={M.esquerda} x2={L - M.direita} y1={y(maximo * fracao)} y2={y(maximo * fracao)} stroke="var(--border-color)" strokeWidth={1} />
                                    <text x={M.esquerda - 8} y={y(maximo * fracao) + 4} textAnchor="end" fontSize={12} fill="var(--text-secondary)">
                                        {inteiro(maximo * fracao)}
                                    </text>
                                </g>
                            ))}
                            {rotulos.map((i) => (
                                <text key={i} x={x(i)} y={A - 8} textAnchor={i === 0 ? "start" : i === pontos.length - 1 ? "end" : "middle"} fontSize={12} fill="var(--text-secondary)">
                                    {diaCurto(pontos[i].dia)}
                                </text>
                            ))}
                            <path d={caminho} fill="none" stroke="var(--secondary-color)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                            {foco !== null && (
                                <g>
                                    <line x1={x(foco)} x2={x(foco)} y1={M.topo} y2={M.topo + alturaUtil} stroke="var(--text-secondary)" strokeWidth={1} strokeDasharray="4 4" />
                                    <circle cx={x(foco)} cy={y(pontos[foco].valor)} r={5} fill="var(--secondary-color)" stroke="var(--bg-secondary)" strokeWidth={2} />
                                </g>
                            )}
                        </svg>
                        {foco !== null && (
                            <div
                                className="absolute top-0 pointer-events-none px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-sm shadow-lg whitespace-nowrap"
                                style={{ left: `${(x(foco) / L) * 100}%`, transform: `translateX(${foco > pontos.length / 2 ? "calc(-100% - 12px)" : "12px"})` }}
                            >
                                <span className="text-[var(--text-secondary)]">{diaCurto(pontos[foco].dia)}</span> <strong>{inteiro(pontos[foco].valor)}</strong>
                            </div>
                        )}
                    </div>
                    <details className="mt-3">
                        <summary className="text-sm font-semibold text-[var(--primary-color)] cursor-pointer">Ver os números em tabela</summary>
                        <div className="mt-3 max-h-64 overflow-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-[var(--text-secondary)]">
                                        <th scope="col" className="py-1 pr-4 font-semibold">
                                            Dia
                                        </th>
                                        <th scope="col" className="py-1 font-semibold text-right">
                                            {atual.nome}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pontos.map((p) => (
                                        <tr key={p.dia} className="border-t border-[var(--border-color)]">
                                            <td className="py-1 pr-4">{diaCurto(p.dia)}</td>
                                            <td className="py-1 text-right tabular-nums">{inteiro(p.valor)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </details>
                </>
            )}
        </div>
    );
}
