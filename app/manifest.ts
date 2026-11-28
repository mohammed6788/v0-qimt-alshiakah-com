import type { MetadataRoute } from "next"
import { BRAND } from "@/lib/constants"

/** Web app manifest: name and icons used when the site is added to a phone's home screen. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.fullName,
    short_name: BRAND.name,
    lang: "ar",
    dir: "rtl",
    start_url: "/",
    display: "browser",
    background_color: "#011d45",
    theme_color: "#011d45",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  }
}
