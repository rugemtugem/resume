import { readFileSync } from "node:fs";
import { join } from "node:path";

export const dynamic = "force-dynamic";

/**
 * Guia de marca, para consulta. A página não aparece no menu, no sitemap nem em buscador (noindex no cabeçalho e
 * na própria página). O arquivo é o mesmo de marca/guia-de-marca.html; aqui só mudam os endereços do logo e da fonte,
 * que o site já serve.
 */
export async function GET() {
    let html: string;
    try {
        html = readFileSync(join(process.cwd(), "content", "marca", "guia-de-marca.html"), "utf8");
    } catch {
        return new Response("Não encontrado", { status: 404 });
    }
    html = html.replaceAll("assets/inter-latin-", "/fontes/inter-latin-").replaceAll("assets/logo-nova.png", "/images/logo-nova.png");
    return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex, nofollow, noarchive", "Cache-Control": "private, no-store" },
    });
}
