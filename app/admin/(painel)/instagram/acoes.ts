"use server";

import { revalidatePath } from "next/cache";
import { exigirAdmin } from "@/lib/admin/sessao";
import { brasiliaParaUtc } from "@/lib/admin/seguranca";
import { agendarPost, cancelarPost, conectarConta, desconectarConta, tentarDeNovo } from "@/lib/instagram/fila";
import { salvarImagem } from "@/lib/instagram/midia";
import { problemasDaLegenda, problemasDasMidias, semToken } from "@/lib/instagram/regras";

export interface Retorno {
    erro: string | null;
    ok: string | null;
}

export async function acaoConectar(_anterior: Retorno, dados: FormData): Promise<Retorno> {
    await exigirAdmin();
    const token = String(dados.get("token") || "");
    try {
        const conta = await conectarConta(token);
        revalidatePath("/admin/instagram");
        return { erro: null, ok: `Conta @${conta.username} conectada.` };
    } catch (e) {
        return { erro: semToken(e instanceof Error ? e.message : "Não foi possível conectar.", token), ok: null };
    }
}

export async function acaoDesconectar(): Promise<void> {
    await exigirAdmin();
    desconectarConta();
    revalidatePath("/admin/instagram");
}

export async function acaoAgendar(_anterior: Retorno, dados: FormData): Promise<Retorno> {
    await exigirAdmin();
    const titulo = String(dados.get("titulo") || "").trim().slice(0, 120);
    const legenda = String(dados.get("legenda") || "");
    const quando = brasiliaParaUtc(String(dados.get("quando") || ""));
    const arquivos = dados.getAll("imagens").filter((a): a is File => a instanceof File && a.size > 0);
    const tipo = arquivos.length > 1 ? "carrossel" : "imagem";

    const problemas = [...problemasDaLegenda(legenda), ...problemasDasMidias(tipo, arquivos.length)];
    if (!titulo) problemas.push("Dê um título para achar a publicação na fila.");
    if (!quando) problemas.push("Escolha a data e a hora.");
    if (arquivos.some((a) => a.size > 8 * 1024 * 1024)) problemas.push("Cada imagem pode ter no máximo 8 MB.");
    if (problemas.length > 0) return { erro: problemas.join(" "), ok: null };

    try {
        const nomes: string[] = [];
        for (const arquivo of arquivos) nomes.push(await salvarImagem(Buffer.from(await arquivo.arrayBuffer()), titulo));
        agendarPost({ tipo, titulo, midias: nomes, legenda: legenda.trim(), quandoUtc: quando as string });
        revalidatePath("/admin/instagram");
        return { erro: null, ok: tipo === "carrossel" ? `Carrossel de ${nomes.length} imagens agendado.` : "Imagem agendada." };
    } catch (e) {
        return { erro: e instanceof Error ? e.message : "Não foi possível agendar.", ok: null };
    }
}

export async function acaoCancelar(dados: FormData): Promise<void> {
    await exigirAdmin();
    cancelarPost(Number(dados.get("id")));
    revalidatePath("/admin/instagram");
}

export async function acaoTentarDeNovo(dados: FormData): Promise<void> {
    await exigirAdmin();
    tentarDeNovo(Number(dados.get("id")));
    revalidatePath("/admin/instagram");
}
