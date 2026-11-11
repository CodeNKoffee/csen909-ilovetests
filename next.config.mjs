/** Static export: works on Vercel, GitHub Pages or any static host. */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
};
export default nextConfig;
