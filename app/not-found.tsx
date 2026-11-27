import Link from "next/link"

export default function NotFound() {
  return (
    <section className="navy-gradient flex min-h-[70svh] items-center pt-24 text-white">
      <div className="container-site text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">الصفحة غير موجودة</h1>
        <p className="mt-3 text-silver">ربما تغيّر الرابط. تصفّح الأقمشة أو ابدأ تصميم ثوبك.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/fabrics" className="btn btn-primary">الأقمشة</Link>
          <Link href="/" className="btn btn-outline-light">الصفحة الرئيسية</Link>
        </div>
      </div>
    </section>
  )
}
