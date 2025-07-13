import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: `${process.env.NEXT_PUBLIC_FINMIND_API_BASE_URL}/:path*`,
        destination: `${process.env.NEXT_PUBLIC_FINMIND_API_URL}/:path*`,
      },
    ];
  },
  /* config options here */
  reactStrictMode: true,
};

export default nextConfig;
