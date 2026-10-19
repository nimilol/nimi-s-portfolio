import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // We use the simple, classic caching model:
  // the public page is cached, and every admin save refreshes it.
  images: {
    // Allow Next.js to optimise images stored in Supabase Storage.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
