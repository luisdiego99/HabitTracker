import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/habits',
        destination: 'http://localhost:3002/habits',
      },
    ];
  },
};