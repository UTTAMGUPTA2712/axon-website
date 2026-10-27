import type { MetadataRoute } from "next";
import { PAGES, SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: PAGES.map((page) => page.path),
      disallow: ["/account", "/extension", "/login", "/register"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
