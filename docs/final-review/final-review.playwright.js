const { chromium, devices } = require('playwright');
const BASE = 'http://localhost:3100';
const results = []; const ok = (n, c, x='') => results.push([c?'PASS':'FAIL', n, x]);
const radio = (p, n) => p.getByRole('radio', { name: n, exact: true });
const errors = [];

async function newCtx(b, opts) {
  const ctx = await b.newContext(opts);
  await ctx.route('https://wa.me/**', r => r.fulfill({ status: 200, contentType: 'text/html', body: 'wa' }));
  ctx.on('page', p => { p.on('pageerror', e => errors.push(e.message)); });
  return ctx;
}
async function fillDesign(p, mobile = true) {
  const next = async () => { await p.evaluate(() => document.activeElement && document.activeElement.blur()); await p.waitForTimeout(200);
    if (mobile) await p.getByTestId('next-mobile').click(); else await p.getByRole('button', { name: /^التالي/ }).click(); await p.waitForTimeout(350); };
  await p.goto(BASE + '/design?fabric=honeycomb', { waitUntil: 'networkidle' });
  await p.evaluate(() => sessionStorage.clear()); await p.reload({ waitUntil: 'networkidle' });
  await next(); await radio(p, 'أبيض').click(); await next();
  await radio(p, 'تفصيل سعودي').click(); await radio(p, 'قلاب فرنسي').click(); await next();
  await radio(p, 'كبك رسمي').click(); await next();
  await radio(p, 'مثلث مخفي – أزرار مخفية').click(); await next();
  await radio(p, 'مشطوف').click(); await p.getByLabel('تفاصيل إضافية').fill('تطريز الاسم'); await p.getByLabel('زيادة الكمية').click(); await next();
  await p.getByRole('radio', { name: /عميل جديد/ }).click(); await p.getByRole('radio', { name: /سأدخل مقاساتي/ }).click();
  for (const [k, v] of [['length','145'],['shoulder','47'],['chest','102'],['sleeve','60'],['neck','40']]) await p.locator(`input[name=m_${k}]`).fill(v);
  await next();
  await p.locator('input[name=name]').fill('أحمد'); await p.locator('input[name=phone]').fill('٧٧٣٤٥٦٧٨٩');
  await p.getByRole('radio', { name: 'داخل المكلا' }).click(); await p.locator('textarea[name=notes]').fill('قبل العيد');
  await p.evaluate(() => document.activeElement && document.activeElement.blur()); await p.waitForTimeout(250);
}
async function send(ctx, p, testid) {
  const [pop] = await Promise.all([ctx.waitForEvent('page', { timeout: 8000 }), p.getByTestId(testid).click()]);
  await pop.waitForURL(/wa\.me/, { timeout: 8000 }).catch(() => {});
  const url = pop.url(); await pop.close();
  return url.includes('text=') ? decodeURIComponent(url.split('text=')[1]) : url;
}

(async () => {
  const b = await chromium.launch();

  // ── 1. Order numbering: QS-0001, QS-0002, same order keeps its number ──
  let ctx = await newCtx(b, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  let p = await ctx.newPage();
  await fillDesign(p);
  ok('معاينة الرسالة توضح أن الرقم يُضاف عند الإرسال', await p.getByText(/يُضاف رقم الطلب \(مثل QS-0001\)/).count() === 1);
  let msg = await send(ctx, p, 'send-mobile');
  ok('الطلب الأول يحصل على QS-0001', msg.includes('رقم الطلب: QS-0001'), msg.split('\n')[1]);
  const must = ['أحمد','+967773456789','المكلا','خلية النحل (قماش كوري)','اللون المطلوب: أبيض','تفصيل سعودي','قلاب فرنسي','كبك رسمي','مثلث مخفي','الجيب: مشطوف','تطريز الاسم','الكمية: 2','عميل جديد – المقاسات مرفقة','طول الثوب: 145 سم','محيط الرقبة: 40 سم','قبل العيد'];
  const miss = must.filter(x => !msg.includes(x));
  ok('6 رسالة واتساب كاملة دون فقدان أي اختيار', miss.length === 0, miss.join(','));
  ok('لا أسعار في الرسالة', !/ر\.ي|\d{2},\d{3}/.test(msg));
  ok('عرض رقم الطلب للعميل بعد الإرسال', (await p.getByTestId('sent-status').textContent()).includes('QS-0001'));
  msg = await send(ctx, p, 'send-mobile');
  ok('إعادة الضغط لنفس الطلب لا تولّد رقماً جديداً', msg.includes('QS-0001'));
  await fillDesign(p);
  msg = await send(ctx, p, 'send-mobile');
  ok('الطلب التالي يحصل على QS-0002', msg.includes('رقم الطلب: QS-0002'), msg.split('\n')[1]);
  await ctx.close();

  // ── 2. Fallback when numbering is unavailable ──
  ctx = await newCtx(b, { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  await ctx.route('**/api/orders', r => r.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"not_configured"}' }));
  p = await ctx.newPage();
  await fillDesign(p);
  msg = await send(ctx, p, 'send-mobile');
  ok('بدون قاعدة بيانات: يُرسل الطلب دون رقم وهمي', !/QS-/.test(msg) && msg.includes('أحمد'));
  ok('بدون قاعدة بيانات: إبلاغ العميل أن الفريق يزوّده بالرقم', (await p.getByTestId('sent-status').textContent()).includes('سيزوّدك فريقنا برقم الطلب'));
  await ctx.close();

  // ── 3. Desktop send button ──
  ctx = await newCtx(b, { viewport: { width: 1440, height: 900 } });
  p = await ctx.newPage();
  await fillDesign(p, false);
  msg = await send(ctx, p, 'send-desktop');
  ok('زر الإرسال على الكمبيوتر → QS-0003', msg.includes('رقم الطلب: QS-0003'));
  await ctx.close();

  // ── 4. /measurements: locked until verified, reorder gets a number ──
  ctx = await newCtx(b, { ...devices['iPhone 13'], defaultBrowserType: undefined });
  p = await ctx.newPage();
  await p.goto(BASE + '/measurements', { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.setItem('qs_measurement_profile_v1', JSON.stringify({ name: 'سعيد', phone: '+967771112223', city: 'المكلا', measurements: { length: '150', shoulder: '48', chest: '106', sleeve: '61' }, savedAt: new Date().toISOString() })));
  await p.reload({ waitUntil: 'networkidle' });
  ok('صفحة المقاسات: المقاسات مخفية قبل التحقق', await p.getByTestId('measurements-locked').isVisible() && !(await p.content()).includes('>150 سم<'));
  await p.getByLabel('رقم الجوال للتحقق').fill('770000000'); await p.getByRole('button', { name: 'تحقق' }).click();
  ok('صفحة المقاسات: رفض رقم غير مطابق', await p.getByText('الرقم لا يطابق المقاسات المحفوظة على هذا الجهاز.').isVisible());
  await p.getByLabel('رقم الجوال للتحقق').fill('771112223'); await p.getByRole('button', { name: 'تحقق' }).click();
  ok('صفحة المقاسات: عرض بعد التحقق', await p.getByText('150 سم').isVisible());
  ok('صفحة المقاسات: توضيح مراجعة الموظف', await p.getByText('يراجع موظفنا مقاساتك المحفوظة ويؤكدها معك').isVisible());
  msg = await send(ctx, p, 'reorder-send');
  ok('إعادة الطلب تحصل على رقم QS-0004', msg.includes('رقم الطلب: QS-0004') && msg.includes('طول الثوب: 150 سم') && msg.includes('أرجو مراجعتها'), msg.split('\n').slice(0,2).join(' | '));
  ok('عرض رقم إعادة الطلب', (await p.getByTestId('reorder-number').textContent()).includes('QS-0004'));
  await ctx.close();

  // ── 5. Copy checks across the site ──
  ctx = await newCtx(b, { viewport: { width: 1280, height: 900 } });
  p = await ctx.newPage();
  const pagesList = ['/', '/fabrics', '/fabrics/honeycomb', '/design', '/measurements', '/about', '/contact'];
  let bad = [], addr = new Set(), phones = new Set();
  for (const path of pagesList) {
    await p.goto(BASE + path, { waitUntil: 'networkidle' });
    const t = await p.evaluate(() => document.body.innerText);
    if (/في دقيقة|في دقائق/.test(t)) bad.push('دقيقة@' + path);
    if (/تلقائياً/.test(t) && /مقاس/.test(t.match(/.{0,60}تلقائياً.{0,30}/)?.[0] || '')) bad.push('تلقائي@' + path);
    if (/مرجعي/.test(t)) bad.push('مرجعي@' + path);
    (t.match(/الشرج[^\n]{0,60}/g) || []).forEach(x => addr.add(x.trim()));
    (await p.$$eval('a[href^="tel:"], a[href*="wa.me"]', as => as.map(a => a.getAttribute('href').split('?')[0]))).forEach(x => phones.add(x));
  }
  ok('3/1 لا عبارات «في دقيقة» أو استرجاع تلقائي أو رقم مرجعي', bad.length === 0, bad.join(','));
  ok('4 أرقام التواصل موحدة (واتساب + اتصال)', [...phones].sort().join(' ') === 'https://wa.me/967738360254 tel:+967770051155', [...phones].join(' '));
  ok('4 العنوان موحد في كل الصفحات', [...addr].every(a => !/دلة|خلف/.test(a)), [...addr].slice(0,4).join(' | '));
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  ok('عبارة «صمم ثوبك بسهولة»', (await p.evaluate(() => document.body.innerText)).includes('صمّم ثوبك بسهولة'));
  await ctx.close();

  // ── 6. iPhone sizes: all pages, overflow + font + sticky bars ──
  const iphones = ['iPhone SE', 'iPhone 12 Mini', 'iPhone 13', 'iPhone 14 Pro Max', 'iPhone 15 Pro Max'].filter(d => devices[d]);
  for (const d of iphones) {
    ctx = await newCtx(b, { ...devices[d] });
    p = await ctx.newPage();
    let issues = [];
    for (const path of pagesList) {
      await p.goto(BASE + path, { waitUntil: 'networkidle' });
      await p.evaluate(() => document.fonts.ready);
      const r = await p.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        font: getComputedStyle(document.body).fontFamily,
        plexLoaded: [...document.fonts].some(f => /Plex/i.test(f.family) && f.status === 'loaded'),
        smallTap: [...document.querySelectorAll('a.btn, button.btn')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.height < 40; }).length,
      }));
      if (r.overflow) issues.push('overflow' + path);
      if (!/Plex/i.test(r.font) || !r.plexLoaded) issues.push('font' + path);
      if (r.smallTap) issues.push(`tap<40px(${r.smallTap})` + path);
    }
    ok(`8 ${d} (${devices[d].viewport.width}×${devices[d].viewport.height}): كل الصفحات`, issues.length === 0, issues.join(','));
    await ctx.close();
  }

  // ── 7. SEO basics on every page ──
  ctx = await newCtx(b, { viewport: { width: 1280, height: 900 } });
  p = await ctx.newPage();
  const titles = new Set(); let seo = [];
  for (const path of [...pagesList, '/fabrics/semiramis-pure', '/fabrics/thai-pure']) {
    await p.goto(BASE + path, { waitUntil: 'domcontentloaded' });
    const r = await p.evaluate(() => ({
      title: document.title, desc: document.querySelector('meta[name=description]')?.content || '',
      canonical: document.querySelector('link[rel=canonical]')?.href || '', h1: document.querySelectorAll('h1').length,
      og: !!document.querySelector('meta[property="og:image"]'), lang: document.documentElement.lang, dir: document.documentElement.dir,
      imgNoAlt: [...document.images].filter(i => !i.hasAttribute('alt')).length,
      ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { return JSON.parse(s.textContent)['@type']; } catch { return 'INVALID'; } }),
    }));
    if (titles.has(r.title)) seo.push('dup-title' + path); titles.add(r.title);
    if (r.desc.length < 50 || r.desc.length > 170) seo.push(`desc(${r.desc.length})` + path);
    if (!r.canonical) seo.push('canonical' + path);
    if (r.h1 !== 1) seo.push(`h1=${r.h1}` + path);
    if (!r.og) seo.push('og' + path);
    if (r.lang !== 'ar' || r.dir !== 'rtl') seo.push('lang' + path);
    if (r.imgNoAlt) seo.push('alt' + path);
    if (r.ld.includes('INVALID') || !JSON.stringify(r.ld).includes('Tailor')) seo.push('ld' + path);
  }
  ok('9 SEO: عنوان فريد، وصف، canonical، H1 واحد، OG، lang/dir، alt، JSON-LD', seo.length === 0, seo.join(','));
  const sm = await (await p.request.get(BASE + '/sitemap.xml')).text();
  ok('9 sitemap.xml يحتوي 12 رابطاً', (sm.match(/<loc>/g) || []).length === 12);
  const rb = await (await p.request.get(BASE + '/robots.txt')).text();
  ok('9 robots.txt يشير إلى sitemap ولا يحجب الموقع', rb.includes('Sitemap: https://qimt-alshiakah.com/sitemap.xml') && !/Disallow: \/\s*$/m.test(rb));
  await ctx.close();

  // ── 8. Rate limit (run last) ──
  ctx = await newCtx(b, {}); p = await ctx.newPage(); await p.goto(BASE + '/contact');
  const codes = await p.evaluate(async () => { const out = []; for (let i = 0; i < 16; i++) { const r = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"kind":"design"}' }); out.push(r.status); } return out; });
  ok('حماية من الطلبات المتكررة (429 بعد 15 طلباً/ساعة)', codes.includes(429), codes.join(','));
  await ctx.close();

  ok('11 لا أخطاء JavaScript', errors.length === 0, errors.slice(0, 3).join(' | '));
  await b.close();
  for (const r of results) console.log(r[0], r[1], r[2] ? '— ' + r[2] : '');
  console.log(`\n${results.filter(r => r[0] === 'PASS').length}/${results.length} passed`);
})().catch(e => { console.error('CRASH', e.message.slice(0, 500)); for (const r of results) console.log(r[0], r[1], r[2] || ''); process.exit(1); });
