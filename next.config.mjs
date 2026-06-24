/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Documents are served via signed URLs from Supabase Storage in production.
  // No remote image patterns are required for the MVP shell.
};

export default nextConfig;
