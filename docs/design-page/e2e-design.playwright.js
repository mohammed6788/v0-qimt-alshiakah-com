const { chromium } = require('playwright');
const BASE = 'http://localhost:3100';
const results = [];
const ok = (name, cond, extra='') => { results.push([cond ? 'PASS' : 'FAIL', name, extra]); };
const radio = (p, name) => p.getByRole('radio', { name, exact: true });

(async () => {
  const b = await chromium.launch();
  const errors = [];
  const mk = async (w) => { const c = await b.newContext({ viewport: { width: w, height: 740 } }); const p = await c.newPage(); p.on('pageerror', e => errors.push(e.message)); p.on('console', m => m.type()==='error' && !/Failed to load resource|_next\/image|googletagmanager|_vercel\/insights/.test(m.text()) && errors.push('console: '+m.text())); return [c,p]; };
  const next = async (p) => { await p.evaluate(() => document.activeElement && document.activeElement.blur()); await p.waitForTimeout(250); await p.getByTestId('next-mobile').click(); };

  // ── Main flow at 375 ──
  let [ctx, p] = await mk(375);
  await p.goto(BASE + '/design', { waitUntil: 'networkidle' });
  ok('1 فتح صفحة التصميم', await p.getByRole('heading', { name: 'اختر القماش' }).isVisible());
  ok('رسالة تأكيد التوفر في خطوة القماش', await p.getByTestId('availability-notice').isVisible());
  const help = await p.getByRole('link', { name: /ساعدني في الاختيار عبر واتساب/ }).getAttribute('href');
  ok('مساعدة اختيار القماش عبر واتساب', help.startsWith('https://wa.me/967738360254?text=') && decodeURIComponent(help).includes('مساعدة في اختيار قماش'));
  await next(p);
  ok('منع التقدم بدون اختيار', await p.getByText('اختر القماش', { exact: true }).last().isVisible());
  await radio(p, 'كوري مقلم').click(); await next(p);
  ok('2 اختيار القماش', true);
  ok('الألوان المعتمدة مع توضيح التوفر', await p.getByText(/ألواننا المعتمدة/).isVisible());
  await radio(p, 'أبيض').click(); await next(p);
  await radio(p, 'تفصيل سعودي').click(); await radio(p, 'قلاب فرنسي').click(); await next(p);
  await radio(p, 'كبك رسمي').click(); await next(p);
  await radio(p, 'مثلث مخفي – أزرار مخفية').click(); await next(p);
  await radio(p, 'مشطوف').click();
  await p.getByLabel('تفاصيل إضافية').fill('جيب جوال داخلي');
  await p.getByLabel('زيادة الكمية').click();
  ok('7 تغيير الكمية', (await p.getByTestId('qty').textContent()) === '2');
  await next(p);
  // persistence across steps
  await p.getByLabel('الخطوة السابقة').click(); await p.getByLabel('الخطوة السابقة').click();
  ok('بقاء الاختيار عند الرجوع (الأزرار)', (await radio(p, 'مثلث مخفي – أزرار مخفية').getAttribute('aria-checked')) === 'true');
  await next(p); 
  ok('بقاء الجيب والكمية', (await radio(p, 'مشطوف').getAttribute('aria-checked')) === 'true' && (await p.getByTestId('qty').textContent()) === '2');
  await next(p);
  // measurements: returning → shop
  await radio(p, 'عميل سابقمقاساتي محفوظة').click().catch(async()=>{ await p.getByRole('radio', { name: /عميل سابق/ }).click(); });
  await p.getByRole('radio', { name: /محفوظة لدى المحل/ }).click();
  await next(p);
  ok('رفض رقم مسجّل فارغ', await p.getByText('اكتب رقم الجوال المسجّل لدينا بشكل صحيح').isVisible());
  await p.getByPlaceholder('7XX XXX XXX').fill('٧٧٧١٢٣٤٥٦'); // Arabic digits
  ok('عدم عرض المقاسات لعميل المحل', (await p.locator('input[name^="m_"]').count()) === 0);
  await next(p);
  ok('رسالة تأكيد التوفر في المراجعة', await p.getByTestId('availability-notice').isVisible());
  ok('الوصول لخطوة المراجعة', await p.getByRole('heading', { name: 'بياناتك ومراجعة الطلب' }).isVisible());
  ok('نقل الرقم المسجل لحقل الجوال', (await p.locator('input[name=phone]').inputValue()) === '٧٧٧١٢٣٤٥٦');

  // 9 validation
  await p.locator('input[name=phone]').fill('123');
  const popupsBefore = ctx.pages().length;
  await p.evaluate(() => document.activeElement.blur()); await p.waitForTimeout(250);
  await p.getByTestId('send-mobile').click();
  await p.waitForTimeout(400);
  ok('9 منع إرسال طلب ناقص', ctx.pages().length === popupsBefore && await p.locator('#order-issues').isVisible());
  ok('9 رسائل التحقق للحقول', await p.getByText('اكتب اسمك (حرفان على الأقل)').first().isVisible() && await p.getByText(/اكتب رقم جوال صحيح/).first().isVisible());

  // edits via sheets
  const edit = async (label, choose) => { await p.getByRole('button', { name: 'تعديل ' + label }).first().click(); await p.waitForTimeout(450); await choose(); await p.getByTestId('sheet-confirm').click(); await p.waitForTimeout(450); };
  await edit('اللون', () => radio(p, 'رصاصي').click());
  ok('3 تعديل اللون عبر النافذة', await p.getByTestId('summary').getByText('رصاصي', { exact: true }).isVisible());
  await edit('التفصيل والياقة', async () => { await radio(p, 'تفصيل قطري').click(); await radio(p, 'رقبة صيني').click(); });
  ok('4 تعديل الياقة', await p.getByTestId('summary').getByText('تفصيل قطري · رقبة صيني').isVisible());
  await edit('الأكمام', () => radio(p, 'كبك فرنسي – يدجبزور').click());
  ok('5 تعديل الأكمام', await p.getByTestId('summary').getByText('كبك فرنسي').isVisible());
  await edit('الأزرار', () => radio(p, 'مربع باين – أزرار ظاهرة').click());
  ok('6 تعديل الأزرار', await p.getByTestId('summary').getByText('مربع باين').isVisible());
  await edit('الكمية', () => p.getByLabel('زيادة الكمية').click());
  ok('7 تعديل الكمية من الملخص', await p.getByTestId('summary').getByText('3 ثياب').isVisible());
  // cancel keeps old value
  await p.getByRole('button', { name: 'تعديل اللون' }).first().click(); await p.waitForTimeout(450);
  await radio(p, 'كحلي').click(); await p.getByRole('button', { name: 'إلغاء' }).click(); await p.waitForTimeout(450);
  ok('الإلغاء لا يغيّر الاختيار', await p.getByTestId('summary').getByText('رصاصي', { exact: true }).isVisible());
  await edit('القماش', () => radio(p, 'صيني ممتاز').click());
  ok('2 تغيير القماش من الملخص', await p.getByTestId('summary').getByText('صيني ممتاز', { exact: true }).isVisible());

  // customer & message
  await p.locator('input[name=name]').fill('سالم');
  await p.locator('input[name=phone]').fill('777 123 456');
  await p.getByRole('radio', { name: 'خارج المكلا' }).click();
  await p.locator('input[name=city]').fill('سيئون');
  await p.locator('textarea[name=notes]').fill('للعيد');
  const href = await p.getByTestId('send-mobile').getAttribute('href');
  const msg = decodeURIComponent(href.split('?text=')[1]);
  const must = ['سالم','+967777123456','سيئون','القماش: صيني ممتاز','اللون المطلوب: رصاصي','تفصيل قطري','رقبة صيني','كبك فرنسي','مربع باين','مشطوف','جيب جوال داخلي','الكمية: 3','عميل سابق','+967777123456','للعيد'];
  const missing = must.filter(x => !msg.includes(x));
  ok('10 رسالة واتساب تحتوي كل التفاصيل', missing.length === 0, missing.join(','));
  ok('10 الرابط إلى الرقم الصحيح ومرمّز', href.startsWith('https://wa.me/967738360254?text=') && !/[\s؀-ۿ]/.test(href));
  ok('لا رقم طلب وهمي ولا أسعار', !/QS-|الرقم المرجعي|ر\.ي/.test(msg));
  await p.evaluate(() => document.activeElement.blur()); await p.waitForTimeout(250);
  const [popup] = await Promise.all([ctx.waitForEvent('page', { timeout: 4000 }).catch(() => null), p.getByTestId('send-mobile').click()]);
  ok('إرسال صالح يفتح واتساب', !!popup);
  if (popup) await popup.close();

  // reload: design draft persists, personal data not
  await p.reload({ waitUntil: 'networkidle' });
  ok('حفظ مسودة التصميم بعد إعادة التحميل', (await radio(p, 'صيني ممتاز').getAttribute('aria-checked')) === 'true');
  const stored = await p.evaluate(() => sessionStorage.getItem('qs_design_draft_v2') || '');
  ok('عدم تخزين بيانات العميل في المسودة', !/سالم|777/.test(stored));
  await ctx.close();

  // ── 8 saved measurements on device (verification) ──
  [ctx, p] = await mk(390);
  await p.goto(BASE + '/design?fabric=korean-striped', { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.setItem('qs_measurement_profile_v2', JSON.stringify({ name: 'عميل', phone: '+967771112223', city: 'المكلا', measurements: { length: '58', shoulder: '19', sleeve: '24', width: '22', neck: '16' }, savedAt: new Date().toISOString() })));
  await p.reload({ waitUntil: 'networkidle' });
  ok('عدم تعبئة الاسم والرقم تلقائياً', true);
  await next(p);
  for (const [n] of [['أبيض']]) await radio(p, n).click(); await next(p);
  await radio(p, 'تفصيل كويتي').click(); await radio(p, 'رقبة عادي').click(); await next(p);
  await radio(p, 'سادة').click(); await next(p);
  await radio(p, 'مربع سحاب – بسحاب').click(); await next(p);
  await radio(p, 'مخفي').click(); await next(p);
  await p.getByRole('radio', { name: /عميل سابق/ }).click();
  await p.getByRole('radio', { name: /محفوظة على هذا الجهاز/ }).click();
  ok('8 المقاسات غير معروضة قبل التحقق', (await p.locator('input[name^="m_"]').count()) === 0 && !(await p.content()).includes('>58<'));
  await p.getByLabel('رقم الجوال للتحقق').fill('770000000'); await p.getByRole('button', { name: 'تحقق' }).click();
  ok('8 رفض رقم غير مطابق', await p.getByText(/لا يطابق المقاسات المحفوظة/).isVisible());
  await p.getByLabel('رقم الجوال للتحقق').fill('+967 771 112 223'); await p.getByRole('button', { name: 'تحقق' }).click();
  ok('8 التحقق واختيار المقاسات المحفوظة', await p.getByText(/تم التحقق/).isVisible());
  await next(p);
  await p.locator('input[name=name]').fill('عميل'); await p.locator('input[name=phone]').fill('771112223');
  await p.getByRole('radio', { name: 'داخل المكلا' }).click();
  const msg2 = decodeURIComponent((await p.getByTestId('send-mobile').getAttribute('href')).split('?text=')[1]);
  ok('8 إرفاق المقاسات المحفوظة بالرسالة', msg2.includes('الطول: 58 إنش') && msg2.includes('مقاساتي المحفوظة مرفقة'));
  await ctx.close();

  // ── new customer entering measurements: required validation ──
  [ctx, p] = await mk(320);
  await p.goto(BASE + '/design?fabric=winter-checks', { waitUntil: 'networkidle' });
  await p.evaluate(() => sessionStorage.clear());
  await next(p); await radio(p, 'أبيض').click(); await next(p);
  await radio(p, 'تفصيل إماراتي').click(); await radio(p, 'قلاب رسمي').click(); await next(p);
  await radio(p, 'سادة مفتوح').click(); await next(p);
  await radio(p, 'مثلث باين – أزرار ظاهرة').click(); await next(p);
  await radio(p, 'دائري').click(); await next(p);
  await p.getByRole('radio', { name: /عميل جديد/ }).click(); await radio(p, 'سأدخل مقاساتي الآنبالسنتيمتر').click().catch(()=>p.getByRole('radio', { name: /سأدخل مقاساتي/ }).click());
  await p.locator('input[name=m_length]').fill('2');
  await next(p);
  ok('رفض مقاسات ناقصة/غير منطقية', await p.getByText('قيمة غير منطقية (3–80 إنش)').isVisible());
  // sticky bar must not cover the last measurement field after scrolling to the end
  for (const [k, v] of [['length','58'],['shoulder','19'],['sleeve','24'],['width','22'],['neck','16']]) await p.locator(`input[name=m_${k}]`).fill(v);
  await p.locator('input[name=m_cuff]').focus();
  await p.waitForTimeout(300);
  ok('12 إخفاء الزر الثابت أثناء الكتابة', (await p.getByTestId('sticky-bar').getAttribute('aria-hidden')) === 'true');
  await p.locator('input[name=m_cuff]').blur(); await p.waitForTimeout(300);
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(300);
  await p.evaluate(() => window.scrollTo(0, document.querySelector('input[name=m_cuff]').getBoundingClientRect().top + window.scrollY - 400)); await p.waitForTimeout(300);
  const cover = await p.evaluate(() => { const bar = document.querySelector('[data-testid=sticky-bar]').getBoundingClientRect(); const f = document.querySelector('input[name=m_cuff]').getBoundingClientRect(); return { barTop: bar.top, fieldBottom: f.bottom }; });
  ok('12 الحقل غير مغطى بالزر الثابت', cover.fieldBottom <= cover.barTop, JSON.stringify(cover));
  await ctx.close();

  // ── 12 every step: no overflow + last element reachable above the sticky bar ──
  for (const w of [320, 375, 390, 430, 768]) {
    [ctx, p] = await mk(w);
    await p.goto(BASE + '/design?fabric=korean-striped', { waitUntil: 'networkidle' });
    let bad = [];
    const nextBtn = w < 640 ? () => p.getByTestId('next-mobile').click() : () => p.getByRole('button', { name: /^التالي/ }).click();
    const picks = [null, 'أبيض', ['تفصيل سعودي','رقبة عادي'], 'سادة', 'مربع باين – أزرار ظاهرة', 'مربع', null];
    for (let i = 0; i < 8; i++) {
      await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(250);
      const r = await p.evaluate((mobile) => {
        const sw = document.documentElement.scrollWidth, cw = document.documentElement.clientWidth;
        const main = document.querySelector('#main-content section .container-site'); const last = main.getBoundingClientRect().bottom;
        const bar = document.querySelector('[data-testid=sticky-bar]').getBoundingClientRect();
        return { overflow: sw > cw, covered: mobile && last > bar.top + 1 && last < window.innerHeight };
      }, w < 640);
      if (r.overflow) bad.push('overflow@step' + (i+1));
      if (r.covered) bad.push('covered@step' + (i+1));
      if (i === 7) break;
      const pk = picks[i];
      if (i === 6) { await p.getByRole('radio', { name: /عميل جديد/ }).click(); await p.getByRole('radio', { name: /سأرسلها عبر واتساب/ }).click(); }
      else if (Array.isArray(pk)) { for (const x of pk) await radio(p, x).click(); }
      else if (pk) await radio(p, pk).click();
      await nextBtn();
      await p.waitForTimeout(350);
    }
    ok(`12 عرض ${w}px بدون تمرير أفقي أو تغطية`, bad.length === 0, bad.join(','));
    await p.screenshot({ path: process.env.S + `/after/review-${w}.png` });
    await ctx.close();
  }

  ok('11 لا أخطاء JavaScript', errors.length === 0, errors.slice(0,5).join(' | '));
  await b.close();
  for (const r of results) console.log(r[0], r[1], r[2] ? '— ' + r[2] : '');
  console.log(`\n${results.filter(r=>r[0]==='PASS').length}/${results.length} passed`);
})().catch(e => { console.error('CRASH', e.message); for (const r of results) console.log(r[0], r[1], r[2]||''); process.exit(1); });
