"use server";

import { revalidatePath } from "next/cache";
import { exigirAdmin } from "@/lib/admin/sessao";
import { limparCacheDeMetricas } from "@/lib/metricas/google";
import { gravarMetaFixa } from "@/lib/metricas/painel";
import type { IdDoIndicador } from "@/lib/metricas/painel";
import { capturarRedes } from "@/lib/metricas/redes";

const INDICADORES: IdDoIndicador[] = ["sessoes", "buscas", "contatos", "leads", "leituras"];

/** Joga fora o que está guardado há até uma hora, lê as redes de novo e consulta o Google de novo. */
export async function acaoAtualizarMetricas(): Promise<void> {
    await exigirAdmin();
    limparCacheDeMetricas();
    await capturarRedes();
    revalidatePath("/admin/metricas");
}

/** Grava as metas fixas (para 30 dias). Campo vazio ou zero volta para a meta automática. */
export async function acaoGravarMetas(dados: FormData): Promise<void> {
    await exigirAdmin();
    for (const id of INDICADORES) {
        const valor = Number(String(dados.get(id) || "").replace(/\D/g, ""));
        gravarMetaFixa(id, Number.isFinite(valor) ? Math.min(valor, 10_000_000) : 0);
    }
    revalidatePath("/admin/metricas");
}
