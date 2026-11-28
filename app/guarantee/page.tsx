import type { Metadata } from "next"
import Link from "next/link"
import { pageOpenGraph } from "@/lib/seo"
import { PolicyPage } from "@/components/site/policy-page"
import { CONTACT } from "@/lib/constants"
import { WhatsAppLink } from "@/components/whatsapp-link"

export const metadata: Metadata = {
  title: "ضمان التفصيل وسياسة التعديلات",
  description: "ضمان قمة الشياكة على التفصيل: نراجع معك تفاصيل الثوب قبل القص، ونعدّل مجاناً أي خطأ منّا في المقاس أو التفصيل المتفق عليه.",
  alternates: { canonical: "/guarantee" },
  openGraph: pageOpenGraph("/guarantee", "ضمان التفصيل وسياسة التعديلات | قمة الشياكة"),
}

export default function GuaranteePage() {
  return (
    <PolicyPage
      path="/guarantee"
      label="ضمان التفصيل والتعديلات"
      eyebrow="ثوبك بضمان"
      title={<>ضمان التفصيل <span className="text-sky">وسياسة التعديلات</span></>}
      description="نلتزم بأن يصلك ثوبك كما اتفقنا عليه: القماش واللون والتفصيل والمقاس."
      updated="نوفمبر 2026"
      intro={
        <p>
          <strong>وعدنا لك:</strong> إذا كان في ثوبك خطأ منّا في المقاس أو في تفاصيل التفصيل التي أكدناها معك، نعدّله لك <strong>مجاناً</strong>.
        </p>
      }
      sections={[
        {
          title: "قبل القص: نتأكد معك من كل شيء",
          points: [
            "بعد إرسال طلبك يراجع فريقنا معك عبر واتساب القماش واللون والياقة والأكمام والأزرار والجيب والمقاسات والسعر وموعد الاستلام.",
            "لا نبدأ القص إلا بعد تأكيدك للتفاصيل، حتى يكون المتفق عليه واضحاً لك ولنا.",
          ],
        },
        {
          title: "ما يشمله الضمان",
          points: [
            "أي اختلاف عن المقاسات المسجلة لديك أو عن تفاصيل التفصيل التي أكدتها معنا.",
            "عيوب الخياطة نفسها، مثل خياطة مفتوحة أو غير متساوية أو زر غير مثبت جيداً.",
            "نصلح هذه الحالات مجاناً، ونتفق معك على موعد التسليم بعد التعديل.",
          ],
        },
        {
          title: "عند الاستلام",
          points: [
            "ننصحك بتجربة الثوب في المحل عند الاستلام، حتى نعدّل أي ملاحظة على المقاس في الحال.",
            "إذا استلمت الثوب من خارج المكلا، راسلنا بملاحظتك مع صورة في أقرب وقت بعد الاستلام، وسنرتب معك طريقة التعديل.",
          ],
        },
        {
          title: "تعديلات خارج الضمان",
          points: [
            "تغيير تفاصيل اتفقنا عليها بعد القص، أو تعديل ثوب بعد مدة من لبسه (مثل تغيّر الوزن)، نقوم به عبر قسم التعديلات لدينا برسوم نوضحها لك قبل البدء.",
            "إذا كانت المقاسات من إدخالك أو قستها بنفسك ولم تكن دقيقة، نساعدك في التعديل برسوم بسيطة نتفق عليها مسبقاً.",
            "نعدّل أيضاً الثياب المخيطة خارج المحل، مثل التقصير والتضييق والتوسيع إذا سمح القماش.",
          ],
        },
        {
          title: "كيف تطلب تعديلاً؟",
          points: [
            <>
              راسلنا على واتساب{" "}
              <WhatsAppLink href={CONTACT.whatsapp} intent="whatsapp_general" placement="guarantee_page" className="font-semibold text-navy underline-offset-4 hover:underline">
                <span dir="ltr">{CONTACT.whatsappDisplay}</span>
              </WhatsAppLink>{" "}
              برقم طلبك أو اسمك، واذكر الملاحظة مع صورة إن أمكن.
            </>,
            <>
              أو زرنا في المحل، والعنوان في صفحة{" "}
              <Link href="/contact" className="font-semibold text-navy underline-offset-4 hover:underline">
                تواصل معنا
              </Link>
              .
            </>,
          ],
        },
      ]}
    />
  )
}
