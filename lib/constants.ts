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
  instagram: "https://www.instagram.com/qimatalshiaka?igsh=NWVkY3hud2ptd3Qw&utm_source=qr",
  // Handle printed on the brand banner (@qimtalshiakah).
  tiktok: "https://www.tiktok.com/@qimtalshiakah",
}

export const FULL_ADDRESS = `${CONTACT.address.region} – ${CONTACT.address.city} – ${CONTACT.address.district}، ${CONTACT.address.street}`

export function whatsappHref(message?: string) {
  if (!message) return CONTACT.whatsapp
  return `${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`
}

// ─────────────────────────────────────────────────────────────
// Fabric products (names, prices, images supplied by the business)
// `origin` mirrors the business-supplied type; `availability` and
// `compareAtPrice` stay undefined until the business confirms them.
// ─────────────────────────────────────────────────────────────

export type Availability = "in_stock" | "limited" | "out_of_stock"

export type Product = {
  id: number
  slug: string
  title: string
  titleEn: string
  description: string
  price: number
  compareAtPrice?: number
  currency: string
  image: string
  tag: string
  type: string
  origin?: string
  availability?: Availability
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    slug: "semiramis-pure",
    title: "سمير اميس الصافي",
    titleEn: "Semeer Amis Pure",
    description: "قماش ياباني فاخر نقي بجودة عالية وملمس ناعم جداً",
    price: 80000,
    currency: "ر.ي",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1776816134280-ha5exzH33zYkTvpCpOwlRvQWfKrh50.png",
    tag: "أفضل الخيارات",
    type: "ياباني",
    origin: "اليابان",
  },
  {
    id: 2,
    slug: "honeycomb",
    title: "خلية النحل",
    titleEn: "Honeycomb",
    description: "قماش كوري بنقشة خلية النحل المتميزة بجودة عالية",
    price: 35000,
    currency: "ر.ي",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1776816161652-NIc4kOX6gdV6E7kw6mpr1bPWSOT0KH.png",
    tag: "كوري",
    type: "كوري",
    origin: "كوريا",
  },
  {
    id: 3,
    slug: "striped-honeycomb",
    title: "مقلم مع خلية",
    titleEn: "Striped Honeycomb",
    description: "قماش صيني بنقشة مقلم مع خلية النحل راقية وفاخرة",
    price: 44900,
    currency: "ر.ي",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1776816174191-3RmZIAS8OaYMqvTtYEAC7WpeUOUlFZ.png",
    tag: "صيني",
    type: "صيني",
    origin: "الصين",
  },
  {
    id: 4,
    slug: "pure-kashmiri",
    title: "صافي كشميري",
    titleEn: "Pure Kashmiri",
    description: "قماش كوري صافي برسمة كشميري ناعمة وراقية",
    price: 32000,
    currency: "ر.ي",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1776816145341-axDw2r668sD7qMifuZEvA30MVMkthy.png",
    tag: "كوري",
    type: "كوري",
    origin: "كوريا",
  },
  {
    id: 5,
    slug: "checks",
    title: "كروهات",
    titleEn: "Checks",
    description: "قماش تايلاندي برسمة كروهات فنية راقية وجميلة",
    price: 30000,
    currency: "ر.ي",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1776816123909-Pc7n4ctfQlE0InfcYF1aGrzXN5z93B.png",
    tag: "تايلاندي",
    type: "تايلاندي",
    origin: "تايلاند",
  },
  {
    id: 6,
    slug: "thai-pure",
    title: "تايلاندي صافي",
    titleEn: "Thai Pure",
    description: "قماش تايلاندي صافي بجودة ممتازة وملمس ناعم جداً",
    price: 38000,
    currency: "ر.ي",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1776816190328-dbv7RK7UdZvu6QFiZtbc0CojJed6ZT.png",
    tag: "تايلاندي",
    type: "تايلاندي",
    origin: "تايلاند",
  },
]

// The business's last published label for the listed price.
export const PRICE_LABEL = "سعر تفصيل الثوب"

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug)
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
