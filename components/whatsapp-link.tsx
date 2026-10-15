"use client"

import { trackWhatsAppClick, type WhatsAppIntent } from "@/lib/analytics"

type WhatsAppLinkProps = {
  href: string
  intent: WhatsAppIntent
  placement: string
  className?: string
  children: React.ReactNode
}

export function WhatsAppLink({ href, intent, placement, className, children }: WhatsAppLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick(intent, placement)}
      className={className}
    >
      {children}
    </a>
  )
}
