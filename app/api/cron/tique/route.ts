import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { pegarTrava, publicarVencidos, registrarBatimento, soltarTrava } from "@/lib/agenda";
import { banco } from "@/lib/db";
import { manutencaoDiaria, publicarVencidosDoInstagram } from "@/lib/instagram/fila";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function autorizado(request: Request): boolean {
    const segredo = process.env.CRON_SECRET || "";
    const recebido = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    if (!segredo || recebido.length !== segredo.length) return false;
    return timingSafeEqual(Buffer.from(recebido), Buffer.from(segredo));
}

/** Diz se a rotina diária ainda não rodou hoje (dia de Brasília) e marca que rodou. */
function primeiraVezHoje(nome: string): boolean {
    const db = banco();
    if (!db) return false;
    const hoje = new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
    const atual = db.prepare("SELECT dia FROM rotina_diaria WHERE nome = ?").get(nome) as { dia: string } | undefined;
    if (atual?.dia === hoje) return false;
    db.prepare("INSERT INTO rotina_diaria (nome, dia) VALUES (?, ?) ON CONFLICT(nome) DO UPDATE SET dia = excluded.dia").run(nome, hoje);
    return true;
}

/**
 * Tique do agendador, chamado a cada 5 minutos. Na ordem: publica os posts do blog que venceram,
 * publica a fila do Instagram e, uma vez por dia, renova o token e limpa mídias sem uso.
 */
export async function POST(request: Request) {
    if (!autorizado(request)) return NextResponse.json({ ok: false }, { status: 401 });
    if (!pegarTrava("tique")) return NextResponse.json({ ok: true, pulado: "já está rodando" });

    try {
        const partes: string[] = [];

        const publicados = publicarVencidos();
        if (publicados.length > 0) {
            for (const caminho of ["/", "/blog", "/blog/rss.xml", "/sitemap.xml", ...publicados.map((slug) => `/blog/${slug}`)]) revalidatePath(caminho);
            partes.push(`Blog: publicou ${publicados.length} (${publicados.join(", ")}).`);
        }

        const instagram = await publicarVencidosDoInstagram();
        if (instagram.publicados > 0) partes.push(`Instagram: publicou ${instagram.publicados}.`);
        if (instagram.erros > 0) partes.push(`Instagram: ${instagram.erros} com erro.`);
        if (instagram.publicados + instagram.erros > 0) revalidatePath("/admin/instagram");

        if (primeiraVezHoje("manutencao")) {
            const manutencao = await manutencaoDiaria();
            if (manutencao) partes.push(manutencao);
        }

        registrarBatimento(partes.length > 0 ? partes.join(" ") : "Nada para publicar.");
        return NextResponse.json({ ok: true, publicados, instagram });
    } finally {
        soltarTrava("tique");
    }
}
