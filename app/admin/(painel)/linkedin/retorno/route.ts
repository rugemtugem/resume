import { concluirAutorizacao } from "@/lib/linkedin/oauth";

export const dynamic = "force-dynamic";

/**
 * Volta do LinkedIn. Esta rota não usa o cookie do painel: como o navegador chega aqui vindo de outro site,
 * o cookie (que só viaja em pedidos do próprio site) não vem junto. Quem prova que o pedido saiu do painel
 * logado é o código de uso único criado no clique em "conectar", conferido e apagado em concluirAutorizacao.
 *
 * A resposta é uma página que leva de volta ao painel. Essa segunda navegação já parte do próprio site,
 * então o cookie vai junto e o painel abre logado.
 */
export async function GET(request: Request) {
    const parametros = new URL(request.url).searchParams;
    let resultado = "falhou";
    if (parametros.get("error")) {
        resultado = "recusado";
    } else {
        try {
            const conta = await concluirAutorizacao(parametros.get("code") || "", parametros.get("state") || "");
            resultado = conta.renovaSozinho ? "renova" : "conectado";
        } catch (e) {
            resultado = e instanceof Error && e.message.startsWith("Este pedido") ? "pedido" : "falhou";
            console.error("Conexão com o LinkedIn:", e instanceof Error ? e.message : e);
        }
    }
    const destino = `/admin/linkedin?r=${resultado}`;
    const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${destino}"><title>Voltando ao painel</title></head><body style="font-family:system-ui;max-width:30rem;margin:20vh auto;padding:0 1rem"><p>Voltando ao painel.</p><p><a href="${destino}">Continuar</a></p></body></html>`;
    return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}
