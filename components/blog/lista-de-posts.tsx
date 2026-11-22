"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Search } from "lucide-react";

export interface PostDaLista {
    slug: string;
    titulo: string;
    descricao: string;
    categoria: "empresas" | "ia";
    categoriaNome: string;
    minutos: number;
    publicadoEm: string;
    dataTexto: string;
    leituras: number;
    capa: string;
}

const FILTROS = [
    { id: "todos", nome: "Todos" },
    { id: "empresas", nome: "Para empresas" },
    { id: "ia", nome: "Dicas de IA" },
] as const;

const ORDENS = [
    { id: "recentes", nome: "Mais recentes" },
    { id: "lidos", nome: "Mais lidos" },
    { id: "rapida", nome: "Leitura rápida" },
] as const;

export function Etiqueta({ categoria, nome }: { categoria: "empresas" | "ia"; nome: string }) {
    const cor = categoria === "ia" ? "bg-[var(--secondary-color)]/15 text-[var(--secondary-color)]" : "bg-[var(--primary-color)]/10 text-[var(--primary-color)]";
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cor}`}>{nome}</span>;
}

/** Grade de posts com busca, filtro por linha e ordenação, como no blog do Calcula Trabalhador. */
export function ListaDePosts({ posts }: { posts: PostDaLista[] }) {
    const [busca, setBusca] = useState("");
    const [filtro, setFiltro] = useState<(typeof FILTROS)[number]["id"]>("todos");
    const [ordem, setOrdem] = useState<(typeof ORDENS)[number]["id"]>("recentes");

    const visiveis = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        const lista = posts.filter((post) => {
            if (filtro !== "todos" && post.categoria !== filtro) return false;
            if (!termo) return true;
            return `${post.titulo} ${post.descricao} ${post.categoriaNome}`.toLowerCase().includes(termo);
        });
        return [...lista].sort((a, b) => {
            if (ordem === "lidos") return b.leituras - a.leituras || b.publicadoEm.localeCompare(a.publicadoEm);
            if (ordem === "rapida") return a.minutos - b.minutos;
            return b.publicadoEm.localeCompare(a.publicadoEm);
        });
    }, [posts, busca, filtro, ordem]);

    return (
        <div>
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-10">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" aria-hidden="true" />
                    <label htmlFor="blog-busca" className="sr-only">
                        Buscar no blog
                    </label>
                    <input
                        id="blog-busca"
                        type="search"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar por assunto"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--bg-primary)] border-2 border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary-color)] transition-colors"
                    />
                </div>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por linha">
                    {FILTROS.map((f) => (
                        <button
                            key={f.id}
                            type="button"
                            onClick={() => setFiltro(f.id)}
                            aria-pressed={filtro === f.id}
                            className={`px-4 py-2.5 rounded-full text-sm font-semibold border-2 transition-colors ${
                                filtro === f.id
                                    ? "border-transparent text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]"
                                    : "border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--primary-color)]"
                            }`}
                        >
                            {f.nome}
                        </button>
                    ))}
                </div>
                <div>
                    <label htmlFor="blog-ordem" className="sr-only">
                        Ordenar
                    </label>
                    <select
                        id="blog-ordem"
                        value={ordem}
                        onChange={(e) => setOrdem(e.target.value as (typeof ORDENS)[number]["id"])}
                        className="w-full lg:w-auto px-4 py-3 rounded-xl bg-[var(--bg-primary)] border-2 border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary-color)]"
                    >
                        {ORDENS.map((o) => (
                            <option key={o.id} value={o.id}>
                                {o.nome}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {visiveis.length === 0 ? (
                <p className="text-center text-[var(--text-secondary)] py-10">Nenhum post encontrado. Tente outra palavra ou outro filtro.</p>
            ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {visiveis.map((post) => (
                        <li key={post.slug}>
                            <Link
                                href={`/blog/${post.slug}`}
                                className="group flex flex-col h-full rounded-2xl overflow-hidden bg-[var(--bg-primary)]/60 backdrop-blur-xl border border-[var(--border-color)]/50 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-[var(--primary-color)]/40 hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element -- miniatura gerada pela rota /blog/capa */}
                                <img src={post.capa} alt="" width={1200} height={630} loading="lazy" decoding="async" className="w-full aspect-[1200/630] object-cover border-b border-[var(--border-color)]/50" />
                                <div className="flex flex-col flex-1 p-6">
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)] mb-3">
                                        <Etiqueta categoria={post.categoria} nome={post.categoriaNome} />
                                        <span className="inline-flex items-center gap-1">
                                            <Clock className="w-4 h-4" aria-hidden="true" />
                                            {post.minutos} min
                                        </span>
                                        <span>{post.dataTexto}</span>
                                    </div>
                                    <h3 className="text-xl font-bold leading-snug mb-3">{post.titulo}</h3>
                                    <p className="text-[var(--text-secondary)] leading-relaxed mb-5 flex-1">{post.descricao}</p>
                                    <span className="inline-flex items-center gap-2 font-semibold text-[var(--primary-color)]">
                                        Ler o post
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
