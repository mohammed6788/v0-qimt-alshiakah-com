"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/site/logo"
import { WhatsAppIcon } from "@/components/site/brand-icons"
import { whatsappHref } from "@/lib/constants"
import { trackWhatsAppClick } from "@/lib/analytics"
import { cn } from "@/lib/utils"

export const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/fabrics", label: "الأقمشة" },
  { href: "/design", label: "صمم ثوبك" },
  { href: "/measurements", label: "المقاسات" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => setIsOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href))

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,padding] duration-300",
        scrolled || isOpen
          ? "border-white/10 bg-navy-deep/95 py-2.5 backdrop-blur-md"
          : "border-transparent bg-navy/80 py-3.5 backdrop-blur-sm",
      )}
    >
      <nav aria-label="التنقل الرئيسي" className="container-site flex items-center justify-between gap-4">
        <Logo size={44} priority />

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2 text-[15px] font-medium transition-colors",
                  isActive(link.href) ? "text-sky" : "text-silver-light hover:text-white",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={whatsappHref("السلام عليكم، أرغب في طلب تفصيل ثوب من قمة الشياكة.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("whatsapp_order", "header")}
            className="btn btn-primary hidden min-h-10 px-4 text-sm sm:inline-flex"
          >
            <WhatsAppIcon className="size-4" />
            اطلب الآن
          </a>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-xl text-white hover:bg-white/10 lg:hidden"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-navigation"
        hidden={!isOpen}
        className="h-[calc(100svh-4rem)] overflow-y-auto border-t border-white/10 bg-navy-deep lg:hidden"
      >
        <ul className="container-site flex flex-col gap-1 py-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "flex min-h-13 items-center rounded-xl px-4 text-lg font-bold",
                  isActive(link.href) ? "bg-white/5 text-sky" : "text-white hover:bg-white/5",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="mt-4">
            <a
              href={whatsappHref("السلام عليكم، أرغب في طلب تفصيل ثوب من قمة الشياكة.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("whatsapp_order", "navigation_mobile")}
              className="btn btn-primary w-full"
            >
              <WhatsAppIcon />
              اطلب عبر واتساب
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
