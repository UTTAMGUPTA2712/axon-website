import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: "2026-10-12",
      changeFrequency: "monthly",
      priority: 1,
      images: [`${SITE_URL}/assets/og-image.png`],
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: "2026-10-12",
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
