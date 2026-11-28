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
  // Official Google Maps listing: "قمة الشياكة | للخياطة الرجالية"
  // feature id 0x3de8e5121df0b77b:0x17a2f38c265e252c (CID 1703191392364143916)
  // = Place ID ChIJe7fwHRLl6D0RLCVeJozzohc. Every map link on the site uses these.
  maps: "https://maps.app.goo.gl/DMGHWyLDjAY7hUAg8",
  mapsEmbed: "https://maps.google.com/maps?cid=1703191392364143916&hl=ar&output=embed",
  /** All reviews of the listing (Google's documented reviews URL for a Place ID). */
  mapsAllReviews: "https://search.google.com/local/reviews?placeid=ChIJe7fwHRLl6D0RLCVeJozzohc&hl=ar",
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

// ─────────────────────────────────────────────────────────────
// CUSTOMER REVIEWS — direct links to individual reviews on the shop's Google
// Maps listing, supplied by the owner. Only links are stored: no names, texts
// or star ratings are shown on the site, so nothing can be misquoted.
// ─────────────────────────────────────────────────────────────
export const REVIEW_LINKS: readonly string[] = [
  "https://maps.app.goo.gl/7KVVLaCw8jx8qdxv5",
  "https://maps.app.goo.gl/Lm2H7HaXSdc1j36o9",
  "https://maps.app.goo.gl/pgpAC9wgoGKSNURW9",
  "https://maps.app.goo.gl/rCgXqEDZ9jC9mW7m8",
]

/** Store policy pages, linked from the footer and from each policy page. */
export const POLICY_LINKS = [
  { href: "/guarantee", label: "ضمان التفصيل والتعديلات" },
  { href: "/privacy", label: "سياسة الخصوصية" },
  { href: "/terms", label: "الشروط والأحكام" },
] as const

/**
 * The shop's official address, exactly as approved by the owner:
 * "حضرموت، المكلا، الشرج، نهاية الشارع الرابع، مقابل كشخة ياعيال".
 * (Google's listing shows its own street name; the site always uses this text.)
 */
export const FULL_ADDRESS = `${CONTACT.address.region}، ${CONTACT.address.city}، ${CONTACT.address.district}، ${CONTACT.address.street}`

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

// The shop's 20 plain colors (photos in /fabrics/colors/, numbered as on the swatch card).
// Shared by every plain fabric; each fabric keeps its own color ids.
const PLAIN_COLORS: [string, string][] = [
  ["white", "أبيض"], ["offwhite", "أوف وايت"], ["cream", "سكري"], ["ivory", "كريمي"],
  ["beige", "بيج"], ["sand", "بيج رملي"], ["desert", "صحراوي"], ["silver", "فضي"],
  ["light-grey", "رصاصي فاتح"], ["grey", "رصاصي"], ["charcoal", "رمادي فحمي"], ["black", "أسود"],
  ["navy", "كحلي"], ["royal-blue", "أزرق ملكي"], ["sky", "سماوي"], ["light-sky", "سماوي فاتح"],
  ["olive", "زيتي"], ["dark-green", "أخضر غامق"], ["burgundy", "عنابي"], ["brown", "بني"],
]

const SEMIRAMIS_COLORS = numberedColors("semiramis", "colors", PLAIN_COLORS)
const KOREAN_COLORS = numberedColors("korean", "colors", PLAIN_COLORS)
const CHINESE_COLORS = numberedColors("chinese", "colors", PLAIN_COLORS)
const WINTER_COLORS = numberedColors("winter", "colors", PLAIN_COLORS)

const HONEYCOMB_STRIPED_COLORS = numberedColors("honeycomb-striped", "honeycomb-striped", [
  ["white", "أبيض"], ["offwhite", "أوف وايت"], ["cream", "سكري"], ["beige", "بيج"], ["camel", "جملي"],
  ["light-grey", "رصاصي فاتح"], ["grey", "رصاصي"], ["black", "أسود"], ["navy", "كحلي"], ["sky", "سماوي"],
])

const BISHT_COLORS = numberedColors("bisht", "bisht-threads", [
  ["white", "أبيض"], ["cream", "سكري"], ["beige", "بيج"], ["grey", "رصاصي"], ["navy", "كحلي"],
  ["offwhite", "أوف وايت"], ["light-beige", "بيج فاتح"], ["light-grey", "رصاصي فاتح"], ["black", "أسود"], ["sky", "سماوي"],
  ["white-2", "أبيض"], ["offwhite-2", "أوف وايت"], ["ivory", "كريمي"], ["beige-2", "بيج"], ["desert", "صحراوي"],
  ["light-grey-2", "رصاصي فاتح"], ["charcoal", "رمادي فحمي"], ["black-2", "أسود"], ["navy-2", "كحلي"], ["sky-2", "سماوي"],
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
  /** Pattern id (see PATTERNS) that this fabric has by nature; preselected in the designer. */
  pattern?: string
}

// ─────────────────────────────────────────────────────────────
// PRICES — the single place to edit prices and discounts.
// Yemeni rial, complete thobe (fabric + tailoring).
//   base: price before discount · sale: current price (omit if no discount)
// A fabric missing here shows "السعر عند الطلب".
// ─────────────────────────────────────────────────────────────
export const PRICES: Record<string, { base: number; sale?: number }> = {
  "japanese-white": { base: 80000, sale: 75000 },
  "semiramis-pure": { base: 45000, sale: 38000 },
  "korean-striped": { base: 45000, sale: 40000 },
  "chinese-premium": { base: 45000, sale: 35000 },
  "winter-checks": { base: 50000, sale: 45000 },
  "honeycomb-formal": { base: 40000 },
  "honeycomb-striped": { base: 40000 },
}

function priced(p: Omit<Product, "price" | "compareAtPrice">): Product {
  const pr = PRICES[p.slug]
  if (!pr) return p
  return pr.sale !== undefined && pr.sale < pr.base ? { ...p, price: pr.sale, compareAtPrice: pr.base } : { ...p, price: pr.base }
}

export const PRODUCTS: Product[] = [
  {
    id: 8,
    slug: "bisht-threads",
    title: "خيوط البشت",
    description: "النقشة الأكثر طلباً، متوفرة بـ20 لوناً",
    type: "خيوط البشت",
    tag: "الأكثر طلباً",
    currency: "ر.ي",
    image: "/fabrics/bisht-threads-real.webp",
    colorOptions: BISHT_COLORS,
    pattern: "bisht_threads",
  },
  {
    id: 1,
    slug: "japanese-white",
    title: "قماش أبيض ياباني",
    description: "قماش ياباني باللون الأبيض لتفصيل الثياب الرجالية",
    type: "ياباني",
    origin: "اليابان",
    currency: "ر.ي",
    image: "/fabrics/japanese-white.webp",
    colors: ["white"],
  },
  {
    id: 2,
    slug: "semiramis-pure",
    title: "سميرا أميس الصافي",
    description: "رقم 1 · متوفر بأكثر من 20 لوناً، يبدأ من الأبيض",
    type: "سميرا أميس",
    currency: "ر.ي",
    image: "/fabrics/semiramis-colors.webp",
    colorOptions: SEMIRAMIS_COLORS,
  },
  {
    id: 3,
    slug: "korean-striped",
    title: "كوري مقلم",
    description: "قماش كوري بنقشة مقلّمة، متوفر بـ20 لوناً",
    type: "كوري",
    origin: "كوريا",
    currency: "ر.ي",
    colorOptions: KOREAN_COLORS,
    pattern: "striped",
  },
  {
    id: 4,
    slug: "chinese-premium",
    title: "صيني ممتاز",
    description: "قماش صيني بجودة ممتازة، متوفر بـ20 لوناً",
    type: "صيني",
    origin: "الصين",
    currency: "ر.ي",
    image: "/fabrics/plain-colors.webp",
    colorOptions: CHINESE_COLORS,
  },
  {
    id: 5,
    slug: "winter-checks",
    title: "شتوي كاروهات",
    description: "قماش شتوي بنقشة كاروهات، متوفر بـ20 لوناً",
    type: "شتوي",
    currency: "ر.ي",
    colorOptions: WINTER_COLORS,
    pattern: "checks",
  },
  {
    id: 6,
    slug: "honeycomb-formal",
    title: "خلية النحل الرسمي",
    description: "قماش بنقشة خلية النحل، متوفر بـ10 ألوان",
    type: "خلية النحل",
    currency: "ر.ي",
    image: "/fabrics/honeycomb-colors.webp",
    colorOptions: HONEYCOMB_COLORS,
    pattern: "honeycomb",
  },
  {
    id: 7,
    slug: "honeycomb-striped",
    title: "خلية مع مقلم",
    description: "خلية النحل مع خطوط مقلّمة، متوفر بـ10 ألوان",
    type: "خلية مع مقلم",
    currency: "ر.ي",
    image: "/fabrics/honeycomb-striped-colors.webp",
    colorOptions: HONEYCOMB_STRIPED_COLORS,
    pattern: "honeycomb_striped",
  },
].map(priced)

// Prices are shown with the old price struck through when discounted.
export const SHOW_PRICES = true

// Prices are for the complete thobe: fabric + tailoring (confirmed by the owner).
export const PRICE_LABEL = "السعر شامل القماش والتفصيل"
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
