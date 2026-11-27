// ─────────────────────────────────────────────────────────────
// Brand & business data — single source of truth.
// Only facts supplied by the business live here. Anything that is
// still unknown is left `undefined` and the UI hides or softens it.
// ─────────────────────────────────────────────────────────────

export const SITE_URL = "https://qimt-alshiakah.com"

export const BRAND = {
  name: "قمة الشياكة",
  fullName: "قمة الشياكة للخياطة الرجالية",
  nameEn: "Qimmat Al-Shiyakah",
  slogan: "قمة الشياكة مصدر الأناقة",
  shortSlogan: "مصدر الأناقة",
  tagline: "خياطة رجالية بتفصيل عصري وجودة عالية",
}

// Official logo (silver + sky blue on navy). Do not recolor or redraw.
export const LOGOS = {
  default: "/brand/logo-512.webp",
  small: "/brand/logo-192.webp",
  full: "/brand/logo.png",
  og: "/brand/og.jpg",
}

export const IMAGES = {
  heroThobe: "/brand/hero-thobe.webp",
  storefront: "/brand/storefront.webp",
}

const WHATSAPP_NUMBER = "967738360254"
const SOCIAL_HANDLE = "qimtalshiakah"

export const CONTACT = {
  whatsappNumber: WHATSAPP_NUMBER,
  whatsappDisplay: "738 360 254",
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER}`,
  // Direct-call line as printed on the shop materials.
  phone: "+967770051155",
  phoneDisplay: "770 051 155",
  address: {
    region: "حضرموت",
    city: "المكلا",
    district: "الشرج",
    street: "نهاية الشارع الرابع، مقابل كشخة ياعيال",
    note: "الفرع الجديد",
  },
  geo: { lat: 14.5327276, lng: 49.1221924 },
  maps: "https://www.google.com/maps/place/%D8%AE%D9%8A%D8%A7%D8%B7+%D9%82%D9%85%D8%A9+%D8%A7%D9%84%D8%B4%D9%8A%D8%A7%D9%83%D8%A9+%7C+%D9%84%D8%A3%D8%AD%D8%AF%D8%AB+%D8%A7%D9%84%D8%A7%D9%82%D9%85%D8%B4%D8%A9+%D8%A7%D9%84%D8%B1%D8%AC%D8%A7%D9%84%D9%8A%D8%A9%D8%8C+%D8%B4%D8%A7%D8%B1%D8%B9+%D8%A7%D9%84%D8%AD%D8%B7%D8%A8+%D9%88%D8%A7%D9%84%D8%B1%D9%85%D8%A7%D9%85+%D9%85%D9%82%D8%A7%D8%A8%D9%84+%D9%83%D8%B4%D8%AE%D8%A9+%D9%8A%D8%A7%D8%B9%D9%8A%D8%A7%D9%84%D8%8C+%D8%A7%D9%84%D9%85%D9%83%D9%84%D8%A7%D8%8C+%D8%A7%D9%84%D9%8A%D9%85%D9%86&ftid=0x3de8e5121df0b77b:0x17a2f38c265e252c&entry=gps",
  mapsEmbed: "https://maps.google.com/maps?q=14.5327276,49.1221924&z=17&hl=ar&output=embed",
  group: "https://chat.whatsapp.com/HKGNCX1JnWR9dWqLczwbf9?mode=gi_t",
  // One unified username across every platform.
  handle: SOCIAL_HANDLE,
  instagram: `https://www.instagram.com/${SOCIAL_HANDLE}`,
  tiktok: `https://www.tiktok.com/@${SOCIAL_HANDLE}`,
  facebook: `https://www.facebook.com/${SOCIAL_HANDLE}`,
  youtube: `https://www.youtube.com/@${SOCIAL_HANDLE}`,
  x: `https://x.com/${SOCIAL_HANDLE}`,
}

export const SOCIAL_LINKS = [
  { id: "instagram", label: "إنستغرام", href: CONTACT.instagram },
  { id: "tiktok", label: "تيك توك", href: CONTACT.tiktok },
  { id: "facebook", label: "فيسبوك", href: CONTACT.facebook },
  { id: "youtube", label: "يوتيوب", href: CONTACT.youtube },
  { id: "x", label: "إكس", href: CONTACT.x },
] as const

export const FULL_ADDRESS = `${CONTACT.address.region} – ${CONTACT.address.city} – ${CONTACT.address.district}، ${CONTACT.address.street}`

export function whatsappHref(message?: string) {
  if (!message) return CONTACT.whatsapp
  return `${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`
}

// ─────────────────────────────────────────────────────────────
// Fabric catalog — the shop's approved fabric types.
// Only data supplied by the business: a missing price or photo stays
// `undefined` and the UI shows "السعر عند الطلب" / "الصورة قريباً".
// ─────────────────────────────────────────────────────────────

export type Availability = "in_stock" | "limited" | "out_of_stock"

/** A photographed color of a specific fabric (numbered as in the shop's swatch card). */
export type ColorOption = { id: string; number: number; label: string; image: string }

/** Builds numbered color options from photos named `NN-<id>.webp` in /fabrics/<dir>/. */
function numberedColors(prefix: string, dir: string, colors: [string, string][]): ColorOption[] {
  return colors.map(([id, label], i) => {
    const n = String(i + 1).padStart(2, "0")
    return { id: `${prefix}-${n}`, number: i + 1, label, image: `/fabrics/${dir}/${n}-${id}.webp` }
  })
}

const SEMIRAMIS_COLORS = numberedColors("semiramis", "semiramis", [
  ["white", "أبيض"], ["offwhite", "أوف وايت"], ["cream", "سكري"], ["ivory", "كريمي"],
  ["beige", "بيج"], ["sand", "بيج رملي"], ["desert", "صحراوي"], ["silver", "فضي"],
  ["light-grey", "رصاصي فاتح"], ["grey", "رصاصي"], ["charcoal", "رمادي فحمي"], ["black", "أسود"],
  ["navy", "كحلي"], ["royal-blue", "أزرق ملكي"], ["sky", "سماوي"], ["light-sky", "سماوي فاتح"],
  ["olive", "زيتي"], ["dark-green", "أخضر غامق"], ["burgundy", "عنابي"], ["brown", "بني"],
])

const HONEYCOMB_COLORS = numberedColors("honeycomb", "honeycomb", [
  ["white", "أبيض"], ["offwhite", "أوف وايت"], ["cream", "سكري"], ["beige", "بيج"], ["camel", "جملي"],
  ["light-grey", "رصاصي فاتح"], ["charcoal", "رمادي فحمي"], ["black", "أسود"], ["navy", "كحلي"], ["sky", "سماوي"],
])

export type Product = {
  id: number
  slug: string
  title: string
  description: string
  /** Short category shown on cards and used by the catalog filter. */
  type: string
  price?: number
  compareAtPrice?: number
  currency: string
  image?: string
  tag?: string
  origin?: string
  availability?: Availability
  /** Color ids (see FABRIC_COLORS) confirmed for this fabric. Undefined = confirmed on order. */
  colors?: string[]
  /** Photographed, numbered colors available for this fabric. */
  colorOptions?: ColorOption[]
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    slug: "japanese-white",
    title: "قماش أبيض ياباني",
    description: "قماش ياباني باللون الأبيض لتفصيل الثياب الرجالية",
    type: "ياباني",
    origin: "اليابان",
    price: 80000,
    currency: "ر.ي",
    image: "/fabrics/japanese-white.webp",
    colors: ["white"],
  },
  {
    id: 2,
    slug: "semiramis-pure",
    title: "سميرا أميس الصافي – رقم 1",
    description: "متوفر بأكثر من 20 لوناً، يبدأ من الأبيض",
    type: "سميرا أميس",
    price: 40000,
    currency: "ر.ي",
    image: "/fabrics/semiramis-colors.webp",
    colorOptions: SEMIRAMIS_COLORS,
  },
  {
    id: 6,
    slug: "honeycomb-formal",
    title: "خلية النحل الرسمي",
    description: "قماش بنقشة خلية النحل، متوفر بـ10 ألوان",
    type: "خلية النحل",
    price: 40000,
    currency: "ر.ي",
    image: "/fabrics/honeycomb-colors.webp",
    colorOptions: HONEYCOMB_COLORS,
  },
  {
    id: 3,
    slug: "korean-striped",
    title: "كوري مقلم",
    description: "قماش كوري بنقشة مقلّمة",
    type: "كوري",
    origin: "كوريا",
    currency: "ر.ي",
  },
  {
    id: 4,
    slug: "chinese-premium",
    title: "صيني ممتاز",
    description: "قماش صيني بجودة ممتازة",
    type: "صيني",
    origin: "الصين",
    currency: "ر.ي",
  },
  {
    id: 5,
    slug: "winter-checks",
    title: "شتوي كاروهات",
    description: "قماش شتوي بنقشة كاروهات",
    type: "شتوي",
    currency: "ر.ي",
  },
]

// Prices are kept in the data but hidden on the site by the owner's request.
// Set to true to show prices again everywhere (cards, details, messages).
export const SHOW_PRICES = false

// Prices are for the complete thobe: fabric + tailoring (confirmed by the owner).
export const PRICE_LABEL = "سعر الثوب كامل (القماش مع التفصيل)"
export const PRICE_ON_REQUEST = "السعر عند الطلب"

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug)
}

/** Arabic count of colors: "10 ألوان" / "20 لوناً". */
export function colorCount(n: number) {
  return n >= 3 && n <= 10 ? `${n} ألوان` : `${n} لوناً`
}

export function colorOptionLabel(o: ColorOption) {
  return `${o.label} (رقم ${o.number})`
}

export function formatPrice(value: number, currency = "ر.ي") {
  return `${value.toLocaleString("en-US")} ${currency}`
}

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  in_stock: "متوفر",
  limited: "كمية محدودة",
  out_of_stock: "غير متوفر حالياً",
}

export const AVAILABILITY_UNKNOWN = "التوفر يُؤكد عبر واتساب"
