import type { MetadataRoute } from "next"
import { PRODUCTS, SITE_URL } from "@/lib/constants"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const pages: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1, freq: "weekly" },
    { path: "/fabrics", priority: 0.9, freq: "weekly" },
    { path: "/design", priority: 0.9, freq: "monthly" },
    { path: "/measurements", priority: 0.8, freq: "monthly" },
    { path: "/contact", priority: 0.7, freq: "monthly" },
    { path: "/about", priority: 0.6, freq: "yearly" },
    { path: "/guarantee", priority: 0.5, freq: "yearly" },
    { path: "/terms", priority: 0.3, freq: "yearly" },
    { path: "/privacy", priority: 0.3, freq: "yearly" },
  ]
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p.path}`, lastModified: now, changeFrequency: p.freq, priority: p.priority })),
    ...PRODUCTS.map((p) => ({
      url: `${SITE_URL}/fabrics/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      ...(p.image && { images: [`${SITE_URL}${p.image}`] }),
    })),
  ]
}
