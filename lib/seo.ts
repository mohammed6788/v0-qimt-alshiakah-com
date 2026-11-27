import type { Metadata } from "next"
import { BRAND, LOGOS, SITE_URL } from "@/lib/constants"

/** Open Graph block for inner pages (keeps the shared share image). */
export function pageOpenGraph(
  path: string,
  title: string,
  description?: string,
  image?: { url: string; alt: string },
): Metadata["openGraph"] {
  return {
    url: `${SITE_URL}${path}`,
    title,
    ...(description && { description }),
    siteName: BRAND.name,
    locale: "ar_YE",
    type: "website",
    images: [image ?? { url: LOGOS.og, width: 1200, height: 630, alt: `شعار ${BRAND.name}` }],
  }
}
