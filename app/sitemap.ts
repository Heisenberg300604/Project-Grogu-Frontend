import type { MetadataRoute } from "next";

import { SITE } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/discover", "/developers", "/gametesters", "/how-it-works"];
  return pages.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
