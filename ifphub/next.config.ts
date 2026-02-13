/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "www.k12digest.com",
      },
      {
        protocol: "https",
        hostname: "www.ifp.es",
      },
      {
        protocol: "https",
        hostname: "fcjxxhayxyylbzpfkast.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
