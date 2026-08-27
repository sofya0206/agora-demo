import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "agora.178.88.115.213.sslip.io",
        port: "",
        pathname: "/files/**",
      },
    ],
  },
};

export default nextConfig;
