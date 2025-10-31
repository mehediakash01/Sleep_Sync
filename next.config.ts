/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    
    ],
  },
   eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
