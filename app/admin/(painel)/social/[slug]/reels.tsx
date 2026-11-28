"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { gerarMp4, parseReels, quadroPng } from "@/lib/reels/motor.js";
import { acaoAgendarReels } from "./acoes";

const botao = "px-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] disabled:opacity-50 disabled:cursor-not-allowed";
const botaoSimples = "px-5 py-2.5 rounded-lg font-semibold border-2 border-[var(--border-color)] hover:border-[var(--primary-color)] disabled:opacity-50";
const campo = "px-4 py-3 rounded-xl bg-[var(--bg-primary)] border-2 border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary-color)]";

interface Pronto {
    video: Blob;
    capa: Blob;
    endereco: string;
    duracao: number;
}

async function enviar(arquivo: Blob, parametros: string, tipo: string): Promise<string> {
    const resposta = await fetch(`/admin/midia?${parametros}`, { method: "POST", body: arquivo, headers: { "Content-Type": tipo } });
    const corpo = (await resposta.json().catch(() => ({}))) as { nome?: string; erro?: string };
    if (!resposta.ok || !corpo.nome) throw new Error(corpo.erro || "Não foi possível enviar o arquivo.");
    return corpo.nome;
}

/**
 * Reels do roteiro: o vídeo é gerado aqui no navegador (precisa do Chrome ou do Edge no computador),
 * conferido na prévia e só então enviado e agendado.
 */
export function Reels({ slug, texto, categoria, trilhas, dataPadrao, bloqueado }: { slug: string; texto: string; categoria: string; trilhas: { id: string; nome: string }[]; dataPadrao: string; bloqueado: boolean }) {
    const [previa, setPrevia] = useState("");
    const [trilha, setTrilha] = useState(trilhas[0]?.id ?? "");
    const [progresso, setProgresso] = useState<number | null>(null);
    const [pronto, setPronto] = useState<Pronto | null>(null);
    const [mensagem, setMensagem] = useState<{ erro: boolean; texto: string } | null>(null);
    const [agendando, comecarAgendamento] = useTransition();
    const [naoCabem, setNaoCabem] = useState<number[]>([]);
    const quando = useRef<HTMLInputElement>(null);

    // A linha de conteúdo do roteiro vira o selo do canto do vídeo.
    const roteiro = () => ({ ...parseReels(texto), trilha: categoria || "Para empresas" });

    useEffect(() => {
        let vivo = true;
        const r = { ...parseReels(texto), trilha: categoria || "Para empresas" };
        // Quadro da primeira cena já assentada, para dar uma ideia antes de gerar o vídeo inteiro.
        quadroPng(r, 540, 960, Math.min(2.2, (r.cenas[0]?.duracao ?? 3) - 0.5))
            .then((q) => {
                if (!vivo) return;
                setPrevia(q.url);
                // O motor mede a altura de cada cena. Se passar da área útil, o texto invade o topo ou o rodapé.
                setNaoCabem(q.diagnostico.cenas.map((c, i) => (c.altura > c.palco ? i + 1 : 0)).filter(Boolean));
            })
            .catch(() => {});
        return () => {
            vivo = false;
        };
    }, [texto, categoria]);

    useEffect(() => () => { if (pronto) URL.revokeObjectURL(pronto.endereco); }, [pronto]);

    async function gerar() {
        setMensagem(null);
        setPronto(null);
        setProgresso(0);
        try {
            const r = await gerarMp4(roteiro(), 1080, 1920, { trilhaUrl: trilha ? `/admin/trilha/${trilha}` : null, onProgresso: (feitos, total) => setProgresso(Math.round((feitos / total) * 100)) });
            setPronto({ video: r.mp4, capa: r.capa, endereco: URL.createObjectURL(r.mp4), duracao: r.duracao });
        } catch (e) {
            setMensagem({ erro: true, texto: e instanceof Error ? e.message : "Não foi possível gerar o vídeo." });
        } finally {
            setProgresso(null);
        }
    }

    function agendar() {
        if (!pronto || !quando.current?.value) return;
        const data = quando.current.value;
        setMensagem(null);
        comecarAgendamento(async () => {
            try {
                const video = await enviar(pronto.video, `tipo=video&nome=${encodeURIComponent(slug + "-reels")}`, "video/mp4");
                const capa = await enviar(pronto.capa, `proporcao=livre&nome=${encodeURIComponent(slug + "-capa")}`, "image/png");
                const dados = new FormData();
                dados.set("slug", slug);
                dados.set("quando", data);
                dados.set("video", video);
                dados.set("capa", capa);
                const retorno = await acaoAgendarReels({ erro: null, ok: null }, dados);
                setMensagem({ erro: Boolean(retorno.erro), texto: retorno.erro || retorno.ok || "" });
            } catch (e) {
                setMensagem({ erro: true, texto: e instanceof Error ? e.message : "Não foi possível agendar." });
            }
        });
    }

    const megas = pronto ? (pronto.video.size / 1024 / 1024).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) : "";

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className="w-56 shrink-0">
                {pronto ? (
                    <video src={pronto.endereco} controls playsInline className="w-full rounded-xl border border-[var(--border-color)]" aria-label="Prévia do Reels gerado" />
                ) : previa ? (
                    // eslint-disable-next-line @next/next/no-img-element -- quadro gerado no navegador
                    <img src={previa} alt="Primeira cena do Reels" width={540} height={960} className="w-full h-auto rounded-xl border border-[var(--border-color)]" />
                ) : (
                    <div className="w-full aspect-[9/16] rounded-xl border border-dashed border-[var(--border-color)]" />
                )}
            </div>
            <div className="space-y-4 min-w-0">
                <div className="flex flex-wrap items-end gap-3">
                    <div>
                        <label htmlFor="reels-trilha" className="block text-sm font-semibold mb-2">
                            Música
                        </label>
                        <select id="reels-trilha" value={trilha} onChange={(e) => setTrilha(e.target.value)} className={campo}>
                            {trilhas.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="button" onClick={gerar} disabled={progresso !== null || bloqueado} className={pronto ? botaoSimples : botao}>
                        {progresso !== null ? `Gerando o vídeo: ${progresso}%` : pronto ? "Gerar de novo" : "Gerar o vídeo"}
                    </button>
                </div>
                {progresso !== null && (
                    <div className="h-2 rounded-full bg-[var(--bg-primary)] overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progresso} aria-label="Geração do vídeo">
                        <div className="h-full bg-[var(--secondary-color)]" style={{ width: `${progresso}%` }} />
                    </div>
                )}
                {pronto && (
                    <>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Vídeo de {pronto.duracao.toLocaleString("pt-BR")} segundos, 1080 x 1920, {megas} MB. Assista até o fim antes de agendar.{" "}
                            <a href={pronto.endereco} download={`reels-${slug}.mp4`} className="font-semibold underline underline-offset-4">
                                Baixar o vídeo
                            </a>
                        </p>
                        <div className="flex flex-wrap items-end gap-3">
                            <div>
                                <label htmlFor="reels-quando" className="block text-sm font-semibold mb-2">
                                    Data e hora (Brasília)
                                </label>
                                <input id="reels-quando" ref={quando} type="datetime-local" defaultValue={dataPadrao} className={campo} />
                            </div>
                            <button type="button" onClick={agendar} disabled={agendando} className={botao}>
                                {agendando ? "Enviando o vídeo..." : "Agendar Reels"}
                            </button>
                        </div>
                    </>
                )}
                {naoCabem.length > 0 && (
                    <p role="alert" className="text-sm text-amber-500">
                        O texto não cabe na tela {naoCabem.length === 1 ? `na cena ${naoCabem[0]}` : `nas cenas ${naoCabem.join(", ")}`}. Encurte o texto ou tire um item no arquivo do roteiro.
                    </p>
                )}
                {mensagem && (
                    <p role={mensagem.erro ? "alert" : "status"} className={`text-sm ${mensagem.erro ? "text-red-500" : "text-emerald-500"}`}>
                        {mensagem.texto}
                    </p>
                )}
                <p className="text-xs text-[var(--text-secondary)]">O vídeo é montado neste navegador, sem câmera: só o texto do roteiro animado. Funciona no Chrome e no Edge, no computador.</p>
            </div>
        </div>
    );
}
