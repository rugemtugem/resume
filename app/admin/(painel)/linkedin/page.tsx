import { ControlesDaLista, Paginacao, SemResultado } from "../lista";
import { filtrarEPaginar, lerPedido } from "@/lib/admin/lista";
import type { Parametros } from "@/lib/admin/lista";
import { horaAtual } from "@/lib/agenda";
import { exigirAdmin } from "@/lib/admin/sessao";
import { utcParaBrasilia } from "@/lib/admin/seguranca";
import { dataPorExtenso } from "@/lib/blog";
import { usandoLinkedinFalso } from "@/lib/linkedin/api";
import { contaDoLinkedin, filaDoLinkedin } from "@/lib/linkedin/fila";
import { enderecoDeRetorno, oauthConfigurado, renovaSozinho } from "@/lib/linkedin/oauth";
import { enderecoDoPost } from "@/lib/linkedin/regras";
import { acaoCancelarNoLinkedin, acaoDesconectarLinkedin, acaoTentarDeNovoNoLinkedin } from "./acoes";
import { FormularioDeTokenDoLinkedin, FormularioDoLinkedin } from "./formularios";

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

/** Mensagens fixas da volta da autorização. O texto nunca vem do endereço, só a chave. */
const RESULTADOS: Record<string, string> = {
    conectado: "ok:Perfil conectado pelo LinkedIn.",
    renova: "ok:Perfil conectado. O LinkedIn entregou a renovação automática: o agendador cuida do token daqui em diante.",
    recusado: "erro:A permissão foi recusada na tela do LinkedIn.",
    pedido: "erro:O pedido não saiu deste painel ou passou de 10 minutos. Clique em conectar de novo.",
    falhou: "erro:O LinkedIn não entregou o token. Confira o Client ID, o Client Secret e o endereço de retorno cadastrado no app.",
};

const cartao = "rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5 md:p-6";
const botaoSimples = "px-5 py-2.5 rounded-lg font-semibold border-2 border-[var(--border-color)] hover:border-[var(--primary-color)]";

export default async function LinkedinPage({ searchParams }: { searchParams: Promise<Parametros> }) {
    await exigirAdmin();
    const parametros = await searchParams;
    const resultado = RESULTADOS[String(parametros.r || "")] || "";
    const comOauth = oauthConfigurado();
    const automatico = renovaSozinho();
    const conta = contaDoLinkedin();
    const fila = filaDoLinkedin();
    const pedidoFila = lerPedido(parametros, "f");
    const resFila = filtrarEPaginar(fila, pedidoFila, { texto: (p) => `${p.titulo} ${p.texto}`, grupo: (p) => p.status, porPagina: 10 });
    const listaFila = { base: "/admin/linkedin", prefixo: "f", parametros, ancora: "fila" };
    const falsa = usandoLinkedinFalso();
    const agora = horaAtual();
    const amanha = utcParaBrasilia(new Date(agora + 24 * 3600e3).toISOString());
    const dias = conta ? Math.floor((Date.parse(conta.expira_em) - agora) / 86400e3) : 0;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">LinkedIn</h1>
                <p className="text-[var(--text-secondary)]">Posts no seu perfil. O que vem dos roteiros é aprovado na tela do roteiro; aqui ficam a conta, os posts avulsos e a fila.</p>
            </div>

            {falsa && (
                <p className="rounded-xl border border-dashed border-amber-500/60 p-4 text-sm text-amber-500">
                    Modo de teste: as publicações vão para uma API falsa nesta máquina. Nada chega ao LinkedIn de verdade.
                </p>
            )}

            <section className={cartao}>
                <h2 className="text-xl font-bold mb-4">Conta</h2>
                {conta ? (
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <p className="text-lg font-semibold">{conta.nome}</p>
                            <p className={`text-sm ${dias <= 10 ? "text-amber-500" : "text-[var(--text-secondary)]"}`}>
                                {dias > 0 ? `Token válido por mais ${dias} dias.` : "O token venceu."}{" "}
                                {automatico
                                    ? "O agendador renova sozinho antes de vencer."
                                    : comOauth
                                      ? dias <= 10
                                          ? "Clique em Renovar agora: é um clique e a permissão no LinkedIn."
                                          : "Para renovar, basta clicar em Renovar agora. Esta tela avisa quando faltarem 10 dias."
                                      : dias <= 10
                                        ? "Gere outro token, desconecte e conecte de novo."
                                        : "Ele não se renova sozinho: perto do fim, esta tela avisa."}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {comOauth && (
                                <a href="/admin/linkedin/conectar" className={botaoSimples}>
                                    Renovar agora
                                </a>
                            )}
                            <form action={acaoDesconectarLinkedin}>
                                <button type="submit" className={botaoSimples}>
                                    Desconectar
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {comOauth && (
                            <div>
                                <a href="/admin/linkedin/conectar" className="inline-block px-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">
                                    Conectar pelo LinkedIn
                                </a>
                                <p className="text-xs text-[var(--text-secondary)] mt-2">Abre a tela de permissão do LinkedIn e volta para cá com o perfil conectado.</p>
                            </div>
                        )}
                        <details open={!comOauth}>
                            <summary className="text-sm font-semibold cursor-pointer">{comOauth ? "Ou cole um token gerado à mão" : "Colar o token de acesso"}</summary>
                            <div className="mt-4">
                                <FormularioDeTokenDoLinkedin />
                            </div>
                        </details>
                        {!comOauth && (
                            <p className="text-xs text-[var(--text-secondary)]">
                                Para conectar e renovar com um clique, configure no servidor as variáveis LINKEDIN_CLIENT_ID e LINKEDIN_CLIENT_SECRET e cadastre no app do LinkedIn o endereço de retorno {enderecoDeRetorno()}
                            </p>
                        )}
                    </div>
                )}
                {resultado && (
                    <p role="status" className={`text-sm mt-4 ${resultado.startsWith("ok:") ? "text-emerald-500" : "text-red-500"}`}>
                        {resultado.replace(/^(ok|erro):/, "")}
                    </p>
                )}
            </section>

            {conta && (
                <section className={cartao}>
                    <h2 className="text-xl font-bold mb-4">Agendar post avulso</h2>
                    <FormularioDoLinkedin dataPadrao={amanha} />
                </section>
            )}

            <section id="fila" className="scroll-mt-24">
                <h2 className="text-xl font-bold mb-4">Fila</h2>
                {fila.length === 0 ? (
                    <p className="text-[var(--text-secondary)]">Nenhum post na fila.</p>
                ) : (
                    <>
                    <ControlesDaLista {...listaFila} pedido={pedidoFila} resultado={resFila} oQue="posts" rotuloDaBusca="Buscar na fila por título ou texto" filtros={[["agendado", "Agendados"], ["publicando", "Publicando"], ["publicado", "Publicados"], ["erro", "Com erro"]]} />
                    {resFila.itens.length === 0 && <SemResultado {...listaFila} pedido={pedidoFila} />}
                    <ul className="space-y-4">
                        {resFila.itens.map((post) => (
                            <li key={post.id} className={cartao}>
                                <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                                    {post.midias.filter((nome) => !nome.endsWith(".pdf")).length > 0 && (
                                        <div className="flex gap-2 shrink-0">
                                            {post.midias.slice(0, 3).map((nome) => (
                                                // eslint-disable-next-line @next/next/no-img-element -- mídia da pasta de dados, servida por /m
                                                <img key={nome} src={`/m/${nome}`} alt="" width={72} height={90} className="w-[72px] h-[90px] object-cover rounded-lg border border-[var(--border-color)]" />
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ROTULO[post.status]?.cor ?? ""}`}>{ROTULO[post.status]?.texto ?? post.status}</span>
                                            <span className="text-xs text-[var(--text-secondary)]">{post.midias.length === 0 ? "Só texto" : post.midias[0].endsWith(".pdf") ? "Carrossel em documento (PDF)" : post.midias.length === 1 ? "1 imagem" : `${post.midias.length} imagens`}</span>
                                        </div>
                                        <h3 className="text-lg font-bold leading-snug">{post.titulo}</h3>
                                        <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2 break-words">{post.texto}</p>
                                        <p className="text-sm text-[var(--text-secondary)] mt-1">
                                            {post.status === "publicado" && post.publicado_em ? `Publicado em ${horaDeBrasilia(post.publicado_em)}.` : `Marcado para ${horaDeBrasilia(post.quando_utc)}.`}
                                            {post.status !== "publicado" && post.tentativas > 0 ? ` Tentativas: ${post.tentativas} de 3.` : ""}
                                        </p>
                                        {post.erro && post.status !== "publicado" && <p className="text-sm text-red-500 mt-2">{post.erro}</p>}
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {post.status === "publicado" && post.post_urn && (
                                            <a href={enderecoDoPost(post.post_urn)} target="_blank" rel="noopener noreferrer" className={botaoSimples}>
                                                Ver no LinkedIn
                                            </a>
                                        )}
                                        {post.status === "erro" && (
                                            <form action={acaoTentarDeNovoNoLinkedin}>
                                                <input type="hidden" name="id" value={post.id} />
                                                <button type="submit" className="px-5 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">
                                                    Tentar de novo
                                                </button>
                                            </form>
                                        )}
                                        {(post.status === "agendado" || post.status === "erro") && (
                                            <form action={acaoCancelarNoLinkedin}>
                                                <input type="hidden" name="id" value={post.id} />
                                                <button type="submit" className={botaoSimples}>
                                                    Cancelar
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <Paginacao {...listaFila} resultado={resFila} oQue="posts" />
                    </>
                )}
            </section>
        </div>
    );
}
