import type { Metadata } from "next"
import Link from "next/link"
import { pageOpenGraph } from "@/lib/seo"
import { PolicyPage } from "@/components/site/policy-page"
import { CONTACT } from "@/lib/constants"

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: "كيف يتعامل موقع قمة الشياكة مع بياناتك: الطلبات تُرسل عبر واتساب، والمقاسات تُحفظ على جهازك فقط وبموافقتك.",
  alternates: { canonical: "/privacy" },
  openGraph: pageOpenGraph("/privacy", "سياسة الخصوصية | قمة الشياكة"),
}

export default function PrivacyPage() {
  return (
    <PolicyPage
      path="/privacy"
      label="سياسة الخصوصية"
      eyebrow="بياناتك بأمان"
      title="سياسة الخصوصية"
      description="نجمع أقل قدر ممكن من البيانات، ولا نبيعها ولا نشاركها لأغراض تسويقية."
      updated="نوفمبر 2026"
      sections={[
        {
          title: "بيانات الطلب",
          points: [
            "عند إرسال طلب أو مقاسات، يُجهَّز الموقع رسالة واتساب تحتوي على اسمك ورقمك ومدينتك وتفاصيل الثوب، وتُرسل منك مباشرة إلى رقم المحل عبر واتساب.",
            "لا يحفظ الموقع اسمك أو رقمك أو مقاساتك على خوادمنا. نستخدم بيانات المحادثة في واتساب فقط لتأكيد طلبك وتنفيذه والتواصل معك بخصوصه.",
            "لكل طلب رقم تسلسلي (مثل QS-0001) يُحفظ معه نوع الطلب ووقته فقط، دون أي بيانات شخصية.",
          ],
        },
        {
          title: "المقاسات المحفوظة على جهازك",
          points: [
            "عند اختيارك «احفظ مقاساتي» تُحفظ بياناتك في متصفح جهازك فقط (التخزين المحلي)، ولا تُرفع إلى أي خادم.",
            "يحفظ مصمم الثوب كذلك مسودة اختياراتك على جهازك حتى لا تضيع إذا أغلقت الصفحة.",
            <>
              يمكنك حذف مقاساتك في أي وقت من صفحة{" "}
              <Link href="/measurements" className="font-semibold text-navy underline-offset-4 hover:underline">
                المقاسات
              </Link>
              ، أو بمسح بيانات المتصفح.
            </>,
          ],
        },
        {
          title: "الإحصاءات والإعلانات",
          points: [
            "نستخدم أدوات قياس (Vercel Analytics وخدمات Google) لمعرفة عدد الزيارات والصفحات الأكثر استخداماً وفاعلية إعلاناتنا، بشكل إجمالي لا يكشف هويتك.",
            "قد تضع خدمات Google ملفات تعريف ارتباط (Cookies) لقياس الإعلانات، ويمكنك التحكم بها من إعدادات متصفحك أو حسابك في Google.",
          ],
        },
        {
          title: "روابط خارجية",
          points: ["يحتوي الموقع على روابط إلى واتساب وخرائط Google وحساباتنا في مواقع التواصل، ولكل منها سياسة خصوصية خاصة بها."],
        },
        {
          title: "تواصل معنا",
          points: [
            <>
              لأي سؤال عن بياناتك أو لطلب حذف محادثة طلبك، راسلنا على واتساب{" "}
              <a href={CONTACT.whatsapp} className="font-semibold text-navy underline-offset-4 hover:underline" dir="ltr">
                {CONTACT.whatsappDisplay}
              </a>
              .
            </>,
          ],
        },
      ]}
    />
  )
}
