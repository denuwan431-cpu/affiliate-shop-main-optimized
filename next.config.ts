import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Product/banner image URLs are added freely by the admin (Daraz CDN,
  // Unsplash, etc.), so we allow any https host instead of hardcoding a list.
  // This lets us use next/image everywhere (auto resize + AVIF/WebP + lazy
  // loading) instead of raw <img> tags.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days — product photos rarely change
  },
};

export default nextConfig;
