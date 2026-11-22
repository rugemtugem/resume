import { postsPublicados } from "@/lib/blog";

export const revalidate = 300;

const SITE = "https://rugemtugem.dev";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function GET() {
    const itens = postsPublicados()
        .filter((post) => !post.rascunho)
        .map(
            (post) => `    <item>
      <title>${esc(post.titulo)}</title>
      <link>${SITE}/blog/${post.slug}</link>
      <guid>${SITE}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publicadoEm).toUTCString()}</pubDate>
      <description>${esc(post.descricao)}</description>
    </item>`,
        )
        .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Blog da Rugemtugem</title>
    <link>${SITE}/blog</link>
    <description>Integração de sistemas para empresas e dicas de IA.</description>
    <language>pt-BR</language>
${itens}
  </channel>
</rss>
`;
    return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
