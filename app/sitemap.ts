import type { MetadataRoute } from "next";
import { pages } from "./content";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const siteUrl = "https://forevermarble.net";
  const toolPages = ["kitchen-virturalizer", "bathroom-virtualizer", "3d-edges"];
  const standalonePages = ["gallery", "specials"];
  return [
    { url: siteUrl, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...Object.keys(pages).map((slug) => ({
      url: `${siteUrl}/${slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: slug === "granite" || slug === "quartz" ? 0.9 : 0.7,
    })),
    ...toolPages.map((slug) => ({
      url: `${siteUrl}/${slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...standalonePages.map((slug) => ({
      url: `${siteUrl}/${slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${siteUrl}/contact-us/`, lastModified: now, changeFrequency: "yearly", priority: 0.9 },
  ];
}
