import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { pegarTrava, publicarVencidos, registrarBatimento, soltarTrava } from "@/lib/agenda";

export const dynamic = "force-dynamic";

function autorizado(request: Request): boolean {
    const segredo = process.env.CRON_SECRET || "";
    const recebido = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    if (!segredo || recebido.length !== segredo.length) return false;
    return timingSafeEqual(Buffer.from(recebido), Buffer.from(segredo));
}

/** Tique do agendador: publica o que venceu e registra que passou. Chamado a cada 5 minutos. */
export async function POST(request: Request) {
    if (!autorizado(request)) return NextResponse.json({ ok: false }, { status: 401 });
    if (!pegarTrava("tique")) return NextResponse.json({ ok: true, pulado: "já está rodando" });

    try {
        const publicados = publicarVencidos();
        if (publicados.length > 0) {
            for (const caminho of ["/", "/blog", "/blog/rss.xml", "/sitemap.xml", ...publicados.map((slug) => `/blog/${slug}`)]) revalidatePath(caminho);
        }
        const linha = publicados.length > 0 ? `Publicou ${publicados.length}: ${publicados.join(", ")}.` : "Nada para publicar.";
        registrarBatimento(linha);
        return NextResponse.json({ ok: true, publicados });
    } finally {
        soltarTrava("tique");
    }
}
