export function AboutSection() {
  return (
    <section id="about" className="py-20 px-5 bg-card">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-10 text-balance">
          مو مجرد خياط… <span className="text-gold">إحنا قصة أناقة</span>
        </h2>
        <div className="bg-secondary p-8 sm:p-10 rounded-3xl border-r-8 border-gold card-shadow">
          <p className="text-lg sm:text-xl text-muted-foreground leading-loose text-pretty">
            بدأت قمة الشياكة بشغف بسيط: <br />
            نخلي كل رجل يلبس ثوبه وهو واثق إنه مختلف. <br />
            <br />
            نهتم بأدق التفاصيل، من أول قياس… إلى آخر خيط. <br />
            هدفنا؟ لما تلبس ثوبك، تحس إنك{" "}
            <strong className="text-foreground italic">{'"نسخة أقوى منك"'}</strong>.
          </p>
        </div>
      </div>
    </section>
  )
}
