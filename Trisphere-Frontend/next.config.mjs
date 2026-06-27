const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  serverExternalPackages: ['pino-pretty'],
  async rewrites() {
    const boardy = process.env.BOARDY_API_URL ?? 'http://localhost:4000';
    const khc = process.env.KHC_API_URL ?? 'http://localhost:5000/api';
    const trend = process.env.TREND_API_URL ?? 'http://localhost:8000';

    return [
      { source: '/api/boardy/:path*', destination: `${boardy}/api/:path*` },
      { source: '/api/khc/:path*', destination: `${khc}/:path*` },
      { source: '/api/trend/:path*', destination: `${trend}/:path*` },
    ];
  },
};

export default nextConfig;
