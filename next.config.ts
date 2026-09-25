import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      { source: "/videos/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=86400, s-maxage=604800" }] },
      { source: "/posters/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=86400, s-maxage=604800" }] },
    ];
  },
};

export default nextConfig;
