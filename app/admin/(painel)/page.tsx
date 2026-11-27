import { agendaDoBlog, horaAtual, ultimoBatimento } from "@/lib/agenda";
import { exigirAdmin } from "@/lib/admin/sessao";
import { utcParaBrasilia } from "@/lib/admin/seguranca";
import Link from "next/link";
import { CATEGORIAS, dataPorExtenso, todosOsPosts } from "@/lib/blog";
import { roteirosSociais } from "@/lib/social";
import { acaoAprovar, acaoDesaprovar } from "./acoes";

function horaDeBrasilia(iso: string): string {
    const d = new Date(Date.parse(iso) - 3 * 3600e3);
    return `${dataPorExtenso(iso)}, ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

function batimentoTexto(): { texto: string; atrasado: boolean } {
    const b = ultimoBatimento();
    if (!b) return { texto: "Agendador: ainda não rodou nenhuma vez.", atrasado: true };
    const minutos = Math.round((Date.now() - Date.parse(b.em)) / 60e3);
    return { texto: `Agendador: última verificação há ${minutos} min. ${b.linha}`, atrasado: minutos > 15 };
}

const ROTULO: Record<string, { texto: string; cor: string }> = {
    rascunho: { texto: "Rascunho", cor: "bg-[var(--border-color)]/40 text-[var(--text-secondary)]" },
    pendente: { texto: "Aguardando aprovação", cor: "bg-amber-500/15 text-amber-500" },
    agendado: { texto: "Agendado", cor: "bg-sky-500/15 text-sky-500" },
    publicado: { texto: "Publicado", cor: "bg-emerald-500/15 text-emerald-500" },
};

export default async function AgendaPage() {
    await exigirAdmin();
    const agenda = agendaDoBlog();
    const agora = horaAtual();
    const posts = todosOsPosts().sort((a, b) => b.publicadoEm.localeCompare(a.publicadoEm));
    const batimento = batimentoTexto();
    const comCarrossel = new Map(roteirosSociais().map((r) => [r.slug, r.roteiro.slides.length]));

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Agenda do blog</h1>
                    <p className="text-[var(--text-secondary)]">Aprove o post com data e hora. Ele entra no site sozinho quando o horário chegar.</p>
                </div>
                <p className={`text-sm px-4 py-2 rounded-lg border ${batimento.atrasado ? "border-amber-500/50 text-amber-500" : "border-[var(--border-color)] text-[var(--text-secondary)]"}`}>
                    {batimento.texto}
                </p>
            </div>

            {posts.length === 0 ? (
                <p className="text-[var(--text-secondary)]">Nenhum post na pasta content/blog.</p>
            ) : (
                <ul className="space-y-4">
                    {posts.map((post) => {
                        const linha = agenda[post.slug];
                        const aprovado = linha && (linha.status === "aprovado" || linha.status === "publicado");
                        const noAr = aprovado && Date.parse(linha.quando_utc) <= agora;
                        const estado = post.rascunho ? "rascunho" : noAr ? "publicado" : aprovado ? "agendado" : "pendente";
                        const quando = linha?.quando_utc ?? post.publicadoEm;

                        return (
                            <li key={post.slug} className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5 md:p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ROTULO[estado].cor}`}>{ROTULO[estado].texto}</span>
                                            <span className="text-xs text-[var(--text-secondary)]">{CATEGORIAS[post.categoria].nome}</span>
                                            <span className="text-xs text-[var(--text-secondary)]">{post.minutos} min de leitura</span>
                                        </div>
                                        <h2 className="text-lg font-bold leading-snug">{post.titulo}</h2>
                                        <p className="text-sm text-[var(--text-secondary)] mt-1">
                                            {estado === "publicado" && `No ar desde ${horaDeBrasilia(quando)}.`}
                                            {estado === "agendado" && `Entra no ar em ${horaDeBrasilia(quando)}.`}
                                            {estado === "pendente" && `Data sugerida no arquivo: ${horaDeBrasilia(post.publicadoEm)}.`}
                                            {estado === "rascunho" && "Tem a linha Rascunho: sim. Tire a linha do arquivo para poder aprovar."}
                                        </p>
                                        {comCarrossel.has(post.slug) && (
                                            <p className="text-sm mt-2">
                                                <Link href={`/admin/social/${post.slug}`} className="font-semibold text-[var(--primary-color)] underline underline-offset-4">
                                                    Tem carrossel de {comCarrossel.get(post.slug)} slides: ver e aprovar os dois juntos
                                                </Link>
                                            </p>
                                        )}
                                    </div>

                                    {!post.rascunho && (
                                        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                                            <form action={acaoAprovar} className="flex flex-col sm:flex-row sm:items-end gap-3">
                                                <input type="hidden" name="slug" value={post.slug} />
                                                <div>
                                                    <label htmlFor={`quando-${post.slug}`} className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                                                        Data e hora (Brasília)
                                                    </label>
                                                    <input
                                                        id={`quando-${post.slug}`}
                                                        name="quando"
                                                        type="datetime-local"
                                                        required
                                                        defaultValue={utcParaBrasilia(quando)}
                                                        className="px-3 py-2.5 rounded-lg bg-[var(--bg-primary)] border-2 border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary-color)]"
                                                    />
                                                </div>
                                                <button type="submit" className="px-5 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">
                                                    {aprovado ? "Salvar nova data" : "Aprovar"}
                                                </button>
                                            </form>
                                            {aprovado && (
                                                <form action={acaoDesaprovar}>
                                                    <input type="hidden" name="slug" value={post.slug} />
                                                    <button type="submit" className="px-5 py-2.5 rounded-lg font-semibold border-2 border-[var(--border-color)] hover:border-[var(--primary-color)]">
                                                        Desaprovar
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
