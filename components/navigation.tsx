"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { LOGOS, CONTACT, whatsappHref } from "@/lib/constants"
import { trackWhatsAppClick } from "@/lib/analytics"

const navLinks = [
  { href: "#home", label: "الرئيسية" },
  { href: "#about", label: "من نحن" },
  { href: "#services", label: "خدماتنا" },
  { href: "#design", label: "صمم ثوبك" },
  { href: "#products", label: "الأقمشة والأسعار" },
  { href: "#gallery", label: "أعمالنا" },
  { href: "#contact", label: "تواصل معنا" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      aria-label="التنقل الرئيسي"
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/95 py-3" : "bg-black/90 py-4"
      } backdrop-blur-md text-white px-6 border-b border-gold/20`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="#home" className="flex items-center gap-3">
          <div className="w-12 h-12 relative">
            <Image
              src={LOGOS.default}
              alt="قمة الشياكة"
              fill
              sizes="48px"
              className="object-contain"
              priority
            />
          </div>
          <span className="text-2xl font-bold gold-gradient">قمة الشياكة</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-white hover:text-gold transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={whatsappHref("السلام عليكم، أرغب في حجز موعد لتفصيل ثوب. ما المواعيد المتاحة؟")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("navigation_desktop")}
            className="btn-gold px-6 py-2 rounded-full font-bold text-black text-sm hidden sm:block"
          >
            احجز الآن
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden text-white min-h-11 min-w-11 flex items-center justify-center rounded-md focus-visible:outline-2 focus-visible:outline-gold"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        id="mobile-navigation"
        hidden={!isOpen}
        className="md:hidden absolute top-full right-0 w-full bg-black/95 backdrop-blur-md border-b border-gold/20"
      >
        <div className="flex flex-col p-6 gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white hover:text-gold transition-colors duration-300 text-lg"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={whatsappHref("السلام عليكم، أرغب في حجز موعد لتفصيل ثوب. ما المواعيد المتاحة؟")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setIsOpen(false)
              trackWhatsAppClick("navigation_mobile")
            }}
            className="btn-gold px-6 py-3 rounded-full font-bold text-black text-center mt-4"
          >
            احجز الآن
          </Link>
        </div>
      </div>
    </nav>
  )
}
