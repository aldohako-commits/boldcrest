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
      // The "Start a Project" route was shortened to /start. 301 the old path
      // so any existing/bookmarked links keep resolving.
      {
        source: "/start-a-new-project",
        destination: "/start",
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
      // Anmetal lived under the old WordPress /services/ path; it's now a
      // project page. 301 to the live slug so the indexed URL consolidates.
      {
        source: "/services/anmetal-your-safety-comes-first-2",
        destination: "/work/anmetal-forged-through-design",
        permanent: true,
      },
      // Javy Coffee wasn't migrated as its own project — send the old indexed
      // URL to the portfolio index rather than letting it 404.
      {
        source: "/work/javy-coffee-brewing-online-success-through-seo-and-ppc",
        destination: "/work",
        permanent: true,
      },
      // Leftover WordPress staging URL (hashed temp domain prefix) that Google
      // still has indexed as a 404. The "team" page is now /people.
      {
        source: "/.website_875c5d33/team",
        destination: "/people",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
