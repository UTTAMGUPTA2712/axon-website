import type { MetadataRoute } from "next";
import { PAGES, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((page) => ({
    url: `${SITE_URL}${page.path === "/" ? "/" : page.path}`,
    lastModified: page.updated,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    ...(page.path === "/" ? { images: [`${SITE_URL}/assets/og-image.png`] } : {}),
  }));
}
