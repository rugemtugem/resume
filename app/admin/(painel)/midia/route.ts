import { NextResponse } from "next/server";
import { adminLogado } from "@/lib/admin/sessao";
import { salvarImagem } from "@/lib/instagram/midia";

export const dynamic = "force-dynamic";

const MAXIMO = 9 * 1024 * 1024;

/**
 * Recebe UMA imagem do painel e devolve o nome com que ela foi guardada.
 * O envio fica aqui, e não nas ações do servidor, porque uma ação lê o corpo inteiro antes de conferir
 * quem está pedindo: com um limite alto, qualquer pessoa sem senha poderia encher a memória do servidor.
 * Aqui a sessão e o tamanho são conferidos antes de ler um byte.
 */
export async function POST(request: Request) {
    if (!(await adminLogado())) return NextResponse.json({ erro: "Entre no painel para enviar imagens." }, { status: 401 });

    const tamanho = Number(request.headers.get("content-length"));
    if (!Number.isFinite(tamanho) || tamanho <= 0) return NextResponse.json({ erro: "O envio veio sem tamanho." }, { status: 411 });
    if (tamanho > MAXIMO) return NextResponse.json({ erro: "Cada imagem pode ter no máximo 8 MB." }, { status: 413 });

    const parametros = new URL(request.url).searchParams;
    const bytes = Buffer.from(await request.arrayBuffer());
    if (bytes.length === 0 || bytes.length > MAXIMO) return NextResponse.json({ erro: "Cada imagem pode ter no máximo 8 MB." }, { status: 413 });

    try {
        const nome = await salvarImagem(bytes, (parametros.get("nome") || "midia").slice(0, 60), parametros.get("proporcao") === "livre");
        return NextResponse.json({ nome });
    } catch (e) {
        return NextResponse.json({ erro: e instanceof Error ? e.message : "O arquivo enviado não é uma imagem." }, { status: 400 });
    }
}
