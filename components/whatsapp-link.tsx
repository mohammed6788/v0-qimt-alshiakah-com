"use client"

import { trackWhatsAppClick } from "@/lib/analytics"

type WhatsAppLinkProps = {
  href: string
  placement: string
  className?: string
  children: React.ReactNode
}

export function WhatsAppLink({ href, placement, className, children }: WhatsAppLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick(placement)}
      className={className}
    >
      {children}
    </a>
  )
}
