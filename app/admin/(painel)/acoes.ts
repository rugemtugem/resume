"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { exigirAdmin, sair } from "@/lib/admin/sessao";
import { brasiliaParaUtc } from "@/lib/admin/seguranca";
import { aprovarPost, desaprovarPost } from "@/lib/agenda";
import { todosOsPosts } from "@/lib/blog";

function atualizarPaginas(slug: string) {
    for (const caminho of ["/", "/blog", `/blog/${slug}`, "/blog/rss.xml", "/sitemap.xml", "/admin"]) revalidatePath(caminho);
}

export async function acaoAprovar(dados: FormData): Promise<void> {
    await exigirAdmin();
    const slug = String(dados.get("slug") || "");
    const quando = brasiliaParaUtc(String(dados.get("quando") || ""));
    const post = todosOsPosts().find((p) => p.slug === slug);
    if (!post || post.rascunho || !quando) return;
    aprovarPost(post.slug, post.titulo, quando);
    atualizarPaginas(post.slug);
}

export async function acaoDesaprovar(dados: FormData): Promise<void> {
    await exigirAdmin();
    const slug = String(dados.get("slug") || "");
    if (!todosOsPosts().some((p) => p.slug === slug)) return;
    desaprovarPost(slug);
    atualizarPaginas(slug);
}

export async function acaoSair(): Promise<void> {
    await sair();
    redirect("/admin/login");
}
