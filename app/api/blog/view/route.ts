import { NextResponse } from "next/server";
import { postPorSlug } from "@/lib/blog";
import { contarLeitura } from "@/lib/blog-views";

/** Conta uma leitura do post. Só aceita slug de post publicado. */
export async function POST(request: Request) {
    let slug = "";
    if (Number(request.headers.get("content-length") || 0) > 2000) return NextResponse.json({ ok: false }, { status: 413 });
    try {
        slug = String((await request.json()).slug || "");
    } catch {
        return NextResponse.json({ ok: false }, { status: 400 });
    }
    const post = postPorSlug(slug);
    if (!post) return NextResponse.json({ ok: false }, { status: 404 });
    if (!post.rascunho) contarLeitura(post.slug);
    return NextResponse.json({ ok: true });
}
