"use client"

import { Drawer } from "vaul"
import { X } from "lucide-react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  /** Footer actions (e.g. confirm button). */
  footer?: React.ReactNode
}

/** Mobile-first bottom sheet (centered panel on wide screens). */
export function EditSheet({ open, onOpenChange, title, description, children, footer }: Props) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} repositionInputs={false}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[60] bg-navy-deep/60 backdrop-blur-[2px]" />
        <Drawer.Content
          dir="rtl"
          className="fixed inset-x-0 bottom-0 z-[70] mx-auto flex max-h-[92svh] w-full max-w-2xl flex-col rounded-t-3xl bg-white outline-none"
        >
          <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-silver" aria-hidden="true" />
          <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-4 sm:px-7">
            <div>
              <Drawer.Title className="type-h3 text-navy">{title}</Drawer.Title>
              {description ? (
                <Drawer.Description className="mt-1 text-sm text-muted-foreground">{description}</Drawer.Description>
              ) : (
                <Drawer.Description className="sr-only">{title}</Drawer.Description>
              )}
            </div>
            <Drawer.Close className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ivory text-navy hover:bg-silver-light" aria-label="إغلاق">
              <X className="size-5" aria-hidden="true" />
            </Drawer.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 sm:px-7" data-vaul-no-drag>
            {children}
          </div>
          {footer && (
            <div className="border-t border-navy/10 bg-white px-5 pt-3 sm:px-7" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
              {footer}
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
