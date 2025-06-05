import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['gauvehvvywdffzavofsf.supabase.co'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  /* config options here */
};

export default nextConfig;
