import Link from "next/link";
import { horaAtual } from "@/lib/agenda";
import { exigirAdmin } from "@/lib/admin/sessao";
import { utcParaBrasilia } from "@/lib/admin/seguranca";
import { dataPorExtenso } from "@/lib/blog";
import { contaConectada, cotaDaConta, filaDoInstagram } from "@/lib/instagram/fila";
import { usandoApiFalsa } from "@/lib/instagram/graph";
import { roteirosSociais } from "@/lib/social";
import { acaoCancelar, acaoDesconectar, acaoTentarDeNovo } from "./acoes";
import { FormularioDeAgendamento, FormularioDeToken } from "./formularios";

function horaDeBrasilia(iso: string): string {
    const d = new Date(Date.parse(iso) - 3 * 3600e3);
    return `${dataPorExtenso(iso)}, ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

const ROTULO: Record<string, { texto: string; cor: string }> = {
    agendado: { texto: "Agendado", cor: "bg-sky-500/15 text-sky-500" },
    publicando: { texto: "Publicando", cor: "bg-amber-500/15 text-amber-500" },
    publicado: { texto: "Publicado", cor: "bg-emerald-500/15 text-emerald-500" },
    erro: { texto: "Erro", cor: "bg-red-500/15 text-red-500" },
};

const cartao = "rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5 md:p-6";

export default async function InstagramPage() {
    await exigirAdmin();
    const conta = contaConectada();
    const cota = conta ? await cotaDaConta() : null;
    const fila = filaDoInstagram();
    const falsa = usandoApiFalsa();
    const roteiros = roteirosSociais();
    const agora = horaAtual();
    const amanha = utcParaBrasilia(new Date(agora + 24 * 3600e3).toISOString());
    const diasDoToken = conta ? Math.round((Date.parse(conta.expira_em) - agora) / 86400e3) : 0;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Instagram</h1>
                <p className="text-[var(--text-secondary)]">Agende imagens e carrosséis. O agendador publica no horário e mostra aqui o resultado.</p>
            </div>

            {falsa && (
                <p className="rounded-xl border border-dashed border-amber-500/60 p-4 text-sm text-amber-500">
                    Modo de teste: as publicações vão para uma API falsa nesta máquina. Nada chega ao Instagram de verdade.
                </p>
            )}

            <section className={cartao}>
                <h2 className="text-xl font-bold mb-4">Conta</h2>
                {conta ? (
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <p className="text-lg font-semibold">@{conta.username}</p>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Tipo: {conta.account_type || "não informado"}.{" "}
                                {diasDoToken > 3650 ? "A validade deste token é a definida na configuração do app na Meta. Se ele vencer, a fila mostra o erro e basta gerar outro." : `Token válido por mais ${diasDoToken} dias.`}
                                {cota ? ` Publicações nas últimas 24 horas: ${cota.usados} de ${cota.total}.` : ""}
                            </p>
                        </div>
                        <form action={acaoDesconectar}>
                            <button type="submit" className="px-5 py-2.5 rounded-lg font-semibold border-2 border-[var(--border-color)] hover:border-[var(--primary-color)]">
                                Desconectar
                            </button>
                        </form>
                    </div>
                ) : (
                    <FormularioDeToken />
                )}
            </section>

            <section className={cartao}>
                <h2 className="text-xl font-bold mb-2">Carrosséis prontos</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-4">Roteiros da pasta content/social. Abra para ver os slides e aprovar.</p>
                {roteiros.length === 0 ? (
                    <p className="text-sm text-[var(--text-secondary)]">Nenhum roteiro na pasta.</p>
                ) : (
                    <ul className="divide-y divide-[var(--border-color)]">
                        {roteiros.map(({ slug, roteiro, problemas }) => {
                            const daFila = fila.find((p) => p.slug === slug && p.tipo === "carrossel");
                            const estado = problemas.length > 0 ? "Com pendência no arquivo" : daFila ? (ROTULO[daFila.status]?.texto ?? daFila.status) : "Aguardando aprovação";
                            return (
                                <li key={slug} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="font-semibold">{roteiro.tema || slug}</p>
                                        <p className="text-xs text-[var(--text-secondary)]">
                                            {roteiro.slides.length} slides. {estado}.
                                        </p>
                                    </div>
                                    <Link href={`/admin/social/${slug}`} className="shrink-0 px-5 py-2.5 rounded-lg font-semibold border-2 border-[var(--border-color)] hover:border-[var(--primary-color)] text-center">
                                        Ver e aprovar
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>

            {conta && (
                <section className={cartao}>
                    <h2 className="text-xl font-bold mb-4">Agendar publicação avulsa</h2>
                    <FormularioDeAgendamento dataPadrao={amanha} />
                </section>
            )}

            <section>
                <h2 className="text-xl font-bold mb-4">Fila</h2>
                {fila.length === 0 ? (
                    <p className="text-[var(--text-secondary)]">Nenhuma publicação na fila.</p>
                ) : (
                    <ul className="space-y-4">
                        {fila.map((post) => (
                            <li key={post.id} className={cartao}>
                                <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                                    <div className="flex gap-2 shrink-0">
                                        {post.midias
                                            .filter((nome) => !nome.endsWith(".mp4"))
                                            .slice(0, 3)
                                            .map((nome) => (
                                                // eslint-disable-next-line @next/next/no-img-element -- mídia da pasta de dados, servida por /m
                                                <img key={nome} src={`/m/${nome}`} alt="" width={72} height={post.tipo === "reels" ? 128 : 90} className={`w-[72px] ${post.tipo === "reels" ? "h-[128px]" : "h-[90px]"} object-cover rounded-lg border border-[var(--border-color)]`} />
                                            ))}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ROTULO[post.status]?.cor ?? ""}`}>{ROTULO[post.status]?.texto ?? post.status}</span>
                                            <span className="text-xs text-[var(--text-secondary)]">{post.tipo === "reels" ? "Reels" : post.tipo === "carrossel" ? `Carrossel de ${post.midias.length} imagens` : "Imagem"}</span>
                                        </div>
                                        <h3 className="text-lg font-bold leading-snug">{post.titulo}</h3>
                                        <p className="text-sm text-[var(--text-secondary)] mt-1">
                                            {post.status === "publicado" && post.publicado_em ? `Publicado em ${horaDeBrasilia(post.publicado_em)}.` : `Marcado para ${horaDeBrasilia(post.quando_utc)}.`}
                                            {post.status !== "publicado" && post.tentativas > 0 ? ` Tentativas: ${post.tentativas} de 3.` : ""}
                                        </p>
                                        {post.erro && post.status !== "publicado" && <p className="text-sm text-red-500 mt-2">{post.erro}</p>}
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {post.status === "publicado" && post.permalink && (
                                            <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg font-semibold border-2 border-[var(--border-color)] hover:border-[var(--primary-color)]">
                                                Ver no Instagram
                                            </a>
                                        )}
                                        {post.status === "erro" && (
                                            <form action={acaoTentarDeNovo}>
                                                <input type="hidden" name="id" value={post.id} />
                                                <button type="submit" className="px-5 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">
                                                    Tentar de novo
                                                </button>
                                            </form>
                                        )}
                                        {(post.status === "agendado" || post.status === "erro") && (
                                            <form action={acaoCancelar}>
                                                <input type="hidden" name="id" value={post.id} />
                                                <button type="submit" className="px-5 py-2.5 rounded-lg font-semibold border-2 border-[var(--border-color)] hover:border-[var(--primary-color)]">
                                                    Cancelar
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
