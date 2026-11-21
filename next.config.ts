import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  devIndicators: false,
  async redirects() {
    // A calculadora saiu do site. O endereço antigo leva para a home.
    return [{ source: "/calculadora-roi", destination: "/", permanent: true }];
  },
};

export default nextConfig;
