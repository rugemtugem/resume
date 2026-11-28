import Link from "next/link";
import { exigirAdmin } from "@/lib/admin/sessao";
import { notFound } from "next/navigation";
import { agendaDoBlog, horaAtual } from "@/lib/agenda";
import { brasiliaParaUtc, utcParaBrasilia, visivelNaAgenda } from "@/lib/admin/seguranca";
import { dataPorExtenso, todosOsPosts } from "@/lib/blog";
import { carrosseisDoSlug, contaConectada } from "@/lib/instagram/fila";
import { contaDoLinkedin, linkedinDoSlug } from "@/lib/linkedin/fila";
import { comLink } from "@/lib/linkedin/regras";
import { postsPublicados } from "@/lib/blog";
import { cliquesDoStory, linkDoStory, roteiroPorSlug } from "@/lib/social";
import { destinoDoStory } from "@/lib/social/story";
import { CopiarLink } from "./copiar";
import { FormularioDeAprovacao } from "./formulario";

function horaDeBrasilia(iso: string): string {
    const d = new Date(Date.parse(iso) - 3 * 3600e3);
    return `${dataPorExtenso(iso)}, ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

const cartao = "rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5 md:p-6";
const NOME_DO_TIPO: Record<string, string> = { capa: "Capa", pontos: "Pontos", numero: "Número", duo: "Antes e depois", cta: "Convite" };

export default async function RoteiroPage({ params }: { params: Promise<{ slug: string }> }) {
    await exigirAdmin();
    const { slug } = await params;
    const arquivo = roteiroPorSlug(slug);
    if (!arquivo) notFound();

    const { roteiro, problemas } = arquivo;
    const post = todosOsPosts().find((p) => p.slug === slug);
    const linhaDoBlog = agendaDoBlog()[slug];
    const naFila = carrosseisDoSlug(slug);
    const pendente = naFila.find((p) => p.status === "agendado" || p.status === "erro");
    const publicado = naFila.find((p) => p.status === "publicado");
    const conta = contaConectada();
    const contaLi = contaDoLinkedin();
    const liPendente = linkedinDoSlug(slug).find((p) => p.status === "agendado" || p.status === "erro");
    const textoDoLinkedin = roteiro.linkedin ? comLink(roteiro.linkedin, process.env.SITE_URL || "https://rugemtugem.dev", roteiro.link || (post ? `/blog/${slug}` : "/"), slug) : "";

    // Com o post já no ar, a data sugerida nunca é a do post (ela já passou e o carrossel sairia na hora): é amanhã.
    const postNoAr = visivelNaAgenda(linhaDoBlog, horaAtual());
    const amanha = new Date(horaAtual() + 24 * 3600e3).toISOString();
    const doRoteiro = roteiro.agendar ? brasiliaParaUtc(roteiro.agendar) : null;
    const sugerida = pendente?.quando_utc ?? (postNoAr ? (doRoteiro && Date.parse(doRoteiro) > horaAtual() ? doRoteiro : amanha) : (linhaDoBlog?.quando_utc ?? doRoteiro ?? post?.publicadoEm ?? amanha));
    const rotulo = post && !postNoAr ? "Aprovar post e agendar carrossel" : "Agendar carrossel";
    const bloqueado = problemas.length > 0 || Boolean(post?.rascunho);
    const link = linkDoStory(slug);
    const cliques = cliquesDoStory(slug);
    const destino = destinoDoStory({ slug, link: roteiro.link, postNoAr: postsPublicados().some((p) => p.slug === slug) }).split("?")[0];

    return (
        <div className="space-y-8">
            <div>
                <Link href="/admin/instagram" className="text-sm font-semibold text-[var(--primary-color)]">
                    Voltar para o Instagram
                </Link>
                <h1 className="text-3xl font-bold mt-3 mb-2">{roteiro.tema || slug}</h1>
                <p className="text-[var(--text-secondary)]">
                    Roteiro em content/social/{slug}.md. {roteiro.slides.length} slides de 1080 x 1350.{" "}
                    {post ? `Acompanha o post do blog "${post.titulo}".` : "Não tem post do blog com o mesmo nome: só o carrossel é agendado."}
                </p>
            </div>

            {problemas.length > 0 && (
                <section className="rounded-2xl border border-red-500/50 p-5 md:p-6" aria-labelledby="titulo-problemas">
                    <h2 id="titulo-problemas" className="text-lg font-bold text-red-500 mb-3">
                        Corrija o arquivo antes de aprovar
                    </h2>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        {problemas.map((p) => (
                            <li key={p}>{p}</li>
                        ))}
                    </ul>
                </section>
            )}

            <section className={cartao} aria-labelledby="titulo-aprovar">
                <h2 id="titulo-aprovar" className="text-xl font-bold mb-2">
                    Aprovar
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mb-5">
                    {post && !postNoAr ? "Um clique aprova o post do blog e agenda o carrossel no mesmo horário. O post entra no ar antes de o carrossel sair." : postNoAr ? "O post do blog já está no ar e não é alterado. O carrossel sai no horário escolhido." : "O carrossel sai no horário escolhido."}{" "}
                    As imagens são gravadas como aparecem abaixo.
                </p>
                <ul className="text-sm space-y-1 mb-5">
                    {post?.rascunho && <li className="text-amber-500">O post do blog tem a linha Rascunho: sim. Tire a linha do arquivo para poder aprovar.</li>}
                    {!conta && <li className="text-amber-500">Nenhuma conta do Instagram conectada. Dá para agendar, mas nada sai enquanto a conta não for conectada.</li>}
                    {roteiro.linkedin && !contaLi && <li className="text-amber-500">Nenhuma conta do LinkedIn conectada. Dá para agendar, mas nada sai enquanto a conta não for conectada.</li>}
                    {liPendente && <li>Já existe um post do LinkedIn deste roteiro na fila para {horaDeBrasilia(liPendente.quando_utc)}. Aprovar de novo troca por este.</li>}
                    {linhaDoBlog && !postNoAr && <li>Post do blog já aprovado para {horaDeBrasilia(linhaDoBlog.quando_utc)}.</li>}
                    {postNoAr && linhaDoBlog && <li className="text-emerald-500">Post do blog no ar desde {horaDeBrasilia(linhaDoBlog.quando_utc)}.</li>}
                    {pendente && (
                        <li>
                            Já existe um carrossel deste roteiro na fila para {horaDeBrasilia(pendente.quando_utc)}
                            {pendente.status === "erro" ? " (com erro)" : ""}. Aprovar de novo troca pelo desta prévia.
                        </li>
                    )}
                    {publicado && <li className="text-emerald-500">Um carrossel deste roteiro já foi publicado{publicado.publicado_em ? ` em ${horaDeBrasilia(publicado.publicado_em)}` : ""}. Aprovar de novo publica outro.</li>}
                </ul>
                <FormularioDeAprovacao slug={slug} dataPadrao={utcParaBrasilia(sugerida)} rotulo={rotulo} bloqueado={bloqueado} temLinkedin={Boolean(roteiro.linkedin)} />
            </section>

            <section aria-labelledby="titulo-slides">
                <h2 id="titulo-slides" className="text-xl font-bold mb-4">
                    Slides
                </h2>
                <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {roteiro.slides.map((slide, i) => (
                        <li key={i}>
                            <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">
                                {i + 1}. {NOME_DO_TIPO[slide.tipo] ?? slide.tipo}
                            </p>
                            {NOME_DO_TIPO[slide.tipo] ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={`/admin/social/${slug}/${i + 1}`}
                                    alt={`Slide ${i + 1}: ${slide.titulo.replace(/[[\]]/g, "")}`}
                                    width={1080}
                                    height={1350}
                                    loading="lazy"
                                    className="w-full h-auto rounded-xl border border-[var(--border-color)]"
                                />
                            ) : (
                                <p className="rounded-xl border border-dashed border-red-500/50 p-4 text-sm text-red-500">Tipo de slide desconhecido.</p>
                            )}
                        </li>
                    ))}
                </ol>
            </section>

            {roteiro.slides.length > 0 && (
                <section className={cartao} aria-labelledby="titulo-story">
                    <h2 id="titulo-story" className="text-xl font-bold mb-2">
                        Story
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)] mb-5">
                        O Instagram não deixa publicar story com adesivo de link pelo sistema, então este passo é pelo celular: baixe a imagem, publique como story, toque em adesivo, escolha Link, cole o endereço e
                        ponha o adesivo em cima do quadro tracejado.
                    </p>
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/admin/social/${slug}/story`} alt={`Story: ${roteiro.slides[0].titulo.replace(/[[\]]/g, "")}`} width={1080} height={1920} loading="lazy" className="w-56 h-auto shrink-0 rounded-xl border border-[var(--border-color)]" />
                        <div className="space-y-4 min-w-0">
                            <div>
                                <a href={`/admin/social/${slug}/story?baixar=1`} className="inline-block px-5 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">
                                    Baixar imagem do story
                                </a>
                            </div>
                            <div>
                                <p className="text-sm font-semibold mb-1">Link do adesivo</p>
                                <p className="text-sm break-all select-all rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 mb-3">{link}</p>
                                <CopiarLink texto={link} />
                            </div>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Hoje este link leva para <strong className="text-[var(--text-primary)]">{destino}</strong>.{" "}
                                {roteiro.link ? "O destino vem da linha link: do roteiro." : post ? "Enquanto o post do blog não está no ar, ele leva para a página inicial." : "Para levar a outra página, ponha a linha link: no começo do roteiro."}
                            </p>
                            <p className="text-sm">
                                Cliques no link: <strong>{cliques.total}</strong>
                                {cliques.dias.length > 0 && <span className="text-[var(--text-secondary)]"> ({cliques.dias.map((d) => `${d.dia.slice(8, 10)}/${d.dia.slice(5, 7)}: ${d.cliques}`).join(", ")})</span>}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            <section className={cartao} aria-labelledby="titulo-linkedin">
                <h2 id="titulo-linkedin" className="text-xl font-bold mb-3">
                    LinkedIn
                </h2>
                {textoDoLinkedin ? (
                    <>
                        <p className="text-sm text-[var(--text-secondary)] mb-3">Sai no seu perfil com os {roteiro.slides.length} slides do carrossel como imagens.</p>
                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{textoDoLinkedin}</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-3">{textoDoLinkedin.length} de 3.000 caracteres.</p>
                    </>
                ) : (
                    <p className="text-sm text-[var(--text-secondary)]">Este roteiro não tem a seção linkedin, então não vai para o LinkedIn. Para ir, acrescente a seção no arquivo.</p>
                )}
            </section>

            <section className={cartao} aria-labelledby="titulo-legenda">
                <h2 id="titulo-legenda" className="text-xl font-bold mb-3">
                    Legenda
                </h2>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{roteiro.legenda || "Sem legenda no arquivo."}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-3">{roteiro.legenda.length} de 2.200 caracteres.</p>
            </section>
        </div>
    );
}
