import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      ...(process.env.DEBUG === 'TRUE'
        ? ['localhost']
        : ['neutral-juliet-isdl-hackathon-7d137747.koyeb.app']),
    ],
  },
};

export default nextConfig;
