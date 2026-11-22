import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  devIndicators: false,
  // Os posts são lidos do disco em tempo de execução: a pasta precisa ir junto no build standalone.
  outputFileTracingIncludes: { "/blog": ["./content/blog/**/*"], "/blog/[slug]": ["./content/blog/**/*"], "/blog/rss.xml": ["./content/blog/**/*"], "/sitemap.xml": ["./content/blog/**/*"], "/blog/capa/[slug]": ["./content/blog/**/*"], "/api/blog/view": ["./content/blog/**/*"] },
  async redirects() {
    // A calculadora saiu do site. O endereço antigo leva para a home.
    return [{ source: "/calculadora-roi", destination: "/", permanent: true }];
  },
};

export default nextConfig;
