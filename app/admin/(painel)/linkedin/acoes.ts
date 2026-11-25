"use server";

import { revalidatePath } from "next/cache";
import { exigirAdmin } from "@/lib/admin/sessao";
import { brasiliaParaUtc } from "@/lib/admin/seguranca";
import { salvarImagem } from "@/lib/instagram/midia";
import { agendarNoLinkedin, cancelarNoLinkedin, conectarLinkedin, desconectarLinkedin, tentarDeNovoNoLinkedin } from "@/lib/linkedin/fila";
import { problemasDoTexto, semTokenDoLinkedin } from "@/lib/linkedin/regras";

export interface Retorno {
    erro: string | null;
    ok: string | null;
}

export async function acaoConectarLinkedin(_anterior: Retorno, dados: FormData): Promise<Retorno> {
    await exigirAdmin();
    const token = String(dados.get("token") || "");
    try {
        const conta = await conectarLinkedin(token);
        revalidatePath("/admin/linkedin");
        return { erro: null, ok: `Perfil de ${conta.nome} conectado.` };
    } catch (e) {
        return { erro: semTokenDoLinkedin(e instanceof Error ? e.message : "Não foi possível conectar.", token), ok: null };
    }
}

export async function acaoDesconectarLinkedin(): Promise<void> {
    await exigirAdmin();
    desconectarLinkedin();
    revalidatePath("/admin/linkedin");
}

export async function acaoAgendarNoLinkedin(_anterior: Retorno, dados: FormData): Promise<Retorno> {
    await exigirAdmin();
    const titulo = String(dados.get("titulo") || "").trim().slice(0, 120);
    const texto = String(dados.get("texto") || "");
    const quando = brasiliaParaUtc(String(dados.get("quando") || ""));
    const arquivos = dados.getAll("imagens").filter((a): a is File => a instanceof File && a.size > 0);

    const problemas = problemasDoTexto(texto);
    if (!titulo) problemas.push("Dê um título para achar a publicação na fila.");
    if (!quando) problemas.push("Escolha a data e a hora.");
    if (arquivos.length > 20) problemas.push("O LinkedIn aceita no máximo 20 imagens por post.");
    if (arquivos.some((a) => a.size > 8 * 1024 * 1024)) problemas.push("Cada imagem pode ter no máximo 8 MB.");
    if (problemas.length > 0) return { erro: problemas.join(" "), ok: null };

    try {
        const nomes: string[] = [];
        for (const arquivo of arquivos) nomes.push(await salvarImagem(Buffer.from(await arquivo.arrayBuffer()), `li-${titulo}`, true));
        agendarNoLinkedin({ titulo, texto: texto.trim(), midias: nomes, quandoUtc: quando as string });
        revalidatePath("/admin/linkedin");
        return { erro: null, ok: nomes.length > 0 ? `Post com ${nomes.length} ${nomes.length === 1 ? "imagem" : "imagens"} agendado.` : "Post de texto agendado." };
    } catch (e) {
        return { erro: e instanceof Error ? e.message : "Não foi possível agendar.", ok: null };
    }
}

export async function acaoCancelarNoLinkedin(dados: FormData): Promise<void> {
    await exigirAdmin();
    cancelarNoLinkedin(Number(dados.get("id")));
    revalidatePath("/admin/linkedin");
}

export async function acaoTentarDeNovoNoLinkedin(dados: FormData): Promise<void> {
    await exigirAdmin();
    tentarDeNovoNoLinkedin(Number(dados.get("id")));
    revalidatePath("/admin/linkedin");
}
