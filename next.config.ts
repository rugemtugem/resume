import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  devIndicators: false,
  poweredByHeader: false,
  // O SQLite tem um binário nativo: fica fora do empacotamento e vai junto no build standalone.
  serverExternalPackages: ["better-sqlite3", "sharp"],
  // Os posts são lidos do disco em tempo de execução: a pasta precisa ir junto no build standalone.
  outputFileTracingIncludes: { "/a-marca": ["./content/marca/*"], "/blog": ["./content/blog/**/*"], "/blog/[slug]": ["./content/blog/**/*"], "/blog/rss.xml": ["./content/blog/**/*"], "/sitemap.xml": ["./content/blog/**/*"], "/blog/capa/[slug]": ["./content/blog/**/*", "./lib/social/fontes/*"], "/api/blog/view": ["./content/blog/**/*"], "/admin": ["./content/**/*"], "/admin/agenda": ["./content/**/*"], "/": ["./content/blog/**/*"], "/api/cron/tique": ["./content/blog/**/*"], "/admin/instagram": ["./content/social/**/*"], "/admin/social/[slug]": ["./content/**/*", "./lib/social/fontes/*"], "/admin/social/[slug]/story": ["./content/social/**/*", "./lib/social/fontes/*"], "/s/[slug]": ["./content/**/*"], "/admin/social/[slug]/[n]": ["./content/social/**/*", "./lib/social/fontes/*"] },
  async headers() {
    // O painel não entra em buscador nem pode ser aberto dentro de outra página.
    const painel = [
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "same-origin" },
    ];
    const site = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Strict-Transport-Security", value: "max-age=31536000" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    return [
      { source: "/:caminho*", headers: site },
      { source: "/admin", headers: painel },
      { source: "/admin/:caminho*", headers: painel },
    ];
  },
  async redirects() {
    // A calculadora saiu do site. O endereço antigo leva para a home.
    return [{ source: "/calculadora-roi", destination: "/", permanent: true }];
  },
};

export default nextConfig;
