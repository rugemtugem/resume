"use server";

import { revalidatePath } from "next/cache";
import { exigirAdmin } from "@/lib/admin/sessao";
import { brasiliaParaUtc } from "@/lib/admin/seguranca";
import { agendarPost, cancelarPost, conectarConta, desconectarConta, tentarDeNovo } from "@/lib/instagram/fila";
import { caminhoDaMidia } from "@/lib/instagram/midia";
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
    // As imagens já foram enviadas para /admin/midia. Aqui chegam só os nomes, e cada um precisa existir na pasta.
    const nomes = dados.getAll("midias").map(String);
    const tipo = nomes.length > 1 ? "carrossel" : "imagem";

    const problemas = [...problemasDaLegenda(legenda), ...problemasDasMidias(tipo, nomes.length)];
    if (nomes.some((nome) => !caminhoDaMidia(nome))) problemas.push("Uma das imagens não chegou ao servidor. Escolha as imagens de novo.");
    if (!titulo) problemas.push("Dê um título para achar a publicação na fila.");
    if (!quando) problemas.push("Escolha a data e a hora.");
    if (problemas.length > 0) return { erro: problemas.join(" "), ok: null };

    try {
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
