import type { MetadataRoute } from "next";
import { pages } from "./content";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const siteUrl = "https://forevermarble.net";
  const toolPages = ["kitchen-virturalizer", "bathroom-virtualizer", "3d-edges"];
  const standalonePages = ["gallery", "specials", "sinks", "faucets", "tile-selection"];
  const productPages = [
    "natural-stones/precioustone",
    "natural-stones/travertine",
    "natural-stones/onyx",
    "natural-stones/slate",
    "natural-stones/soapstone",
    "quartz/cambria",
    "quartz/caesarstone",
    "quartz/sliestone",
    "quartz/msi-quartz",
    "quartz/emerstone",
    "quartz/pentalquartz",
    "quartz/one-quartz-surfaces",
    "quartz/spectrum-quartz",
    "quartz/wilsonart",
    "quartz/zodiac",
    "sinks/kitchen-sinks",
    "sinks/bathroom-sinks",
    "sinks/bar-sinks",
    "faucets/bathroom-faucets",
    "faucets/kitchen-faucets",
  ];
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
    ...productPages.map((slug) => ({
      url: `${siteUrl}/${slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${siteUrl}/contact-us/`, lastModified: now, changeFrequency: "yearly", priority: 0.9 },
  ];
}
