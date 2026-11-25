"use server";

import { redirect } from "next/navigation";
import { entrar } from "@/lib/admin/sessao";

export async function acaoEntrar(_anterior: { erro: string | null }, dados: FormData): Promise<{ erro: string | null }> {
    const erro = await entrar(String(dados.get("senha") || ""));
    if (erro) return { erro };
    redirect("/admin");
}
