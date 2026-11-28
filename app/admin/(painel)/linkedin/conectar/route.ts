import { NextResponse } from "next/server";
import { adminLogado } from "@/lib/admin/sessao";
import { iniciarAutorizacao } from "@/lib/linkedin/oauth";

export const dynamic = "force-dynamic";

/** Começa a conexão com o LinkedIn: só para quem está logado, manda para a tela de permissão do LinkedIn. */
export async function GET(request: Request) {
    const site = (process.env.SITE_URL || new URL(request.url).origin).replace(/\/+$/, "");
    if (!(await adminLogado())) return NextResponse.redirect(`${site}/admin/login`);
    try {
        return NextResponse.redirect(iniciarAutorizacao());
    } catch {
        return NextResponse.redirect(`${site}/admin/linkedin?r=falhou`);
    }
}
