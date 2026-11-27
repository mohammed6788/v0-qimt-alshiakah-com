import Link from "next/link"
import { Scissors } from "lucide-react"
import { WhatsAppLink } from "@/components/whatsapp-link"
import { WhatsAppIcon } from "@/components/site/brand-icons"
import { whatsappHref } from "@/lib/constants"

type Props = { title?: string; text?: string; placement?: string }

/** Closing call-to-action used at the end of most pages. */
export function CtaBand({
  title = "جاهز لثوبك القادم؟",
  text = "صمّم ثوبك في دقيقة، أو راسلنا مباشرة وسنساعدك في اختيار القماش والتفصيل.",
  placement = "cta_band",
}: Props) {
  return (
    <section className="navy-gradient py-16 text-white sm:py-20">
      <div className="container-site flex flex-col items-center text-center">
        <h2 className="text-3xl font-extrabold text-balance sm:text-4xl">{title}</h2>
        <p className="mt-3 max-w-xl text-lg text-silver text-pretty">{text}</p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href="/design" className="btn btn-primary">
            <Scissors className="size-5" aria-hidden="true" />
            صمم ثوبك
          </Link>
          <WhatsAppLink
            href={whatsappHref("السلام عليكم، أرغب في طلب تفصيل ثوب من قمة الشياكة.")}
            intent="whatsapp_order"
            placement={placement}
            className="btn btn-outline-light"
          >
            <WhatsAppIcon />
            اطلب عبر واتساب
          </WhatsAppLink>
        </div>
      </div>
    </section>
  )
}
