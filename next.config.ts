import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  turbopack: {
    // Disable Turbopack for middleware to avoid NFT build errors
    resolveAlias: {},
  },
};

export default nextConfig;
