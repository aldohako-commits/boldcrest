import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async redirects() {
    return [
      // The Privacy Notice page used to live at /privacy-policy. Permanently
      // redirect the old path so existing/cached links keep resolving.
      {
        source: "/privacy-policy",
        destination: "/privacy-notice",
        permanent: true,
      },
      // WordPress→Next migration: a few project slugs were shortened. 301 the
      // old WordPress slug to the new one so Google consolidates the indexed
      // page (and old backlinks keep resolving) instead of hitting a 404.
      // Old trailing-slash URLs are normalised by Next before matching.
      {
        source: "/work/ak-invest-secure-money-transfers-in-the-blink-of-an-eye",
        destination: "/work/ak-invest-fast-secure-transfers",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
