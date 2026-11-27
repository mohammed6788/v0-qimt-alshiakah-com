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
  await p.goto(BASE + '/design?fabric=korean-striped', { waitUntil: 'networkidle' });
  await p.evaluate(() => sessionStorage.clear()); await p.reload({ waitUntil: 'networkidle' });
  await next(); await radio(p, 'أبيض').click(); await next();
  await radio(p, 'تفصيل سعودي').click(); await radio(p, 'قلاب فرنسي').click(); await next();
  await radio(p, 'كبك رسمي').click(); await next();
  await radio(p, 'مثلث مخفي – أزرار مخفية').click(); await next();
  await radio(p, 'مشطوف').click(); await p.getByLabel('تفاصيل إضافية').fill('تطريز الاسم'); await p.getByLabel('زيادة الكمية').click(); await next();
  await p.getByRole('radio', { name: /عميل جديد/ }).click(); await p.getByRole('radio', { name: /سأدخل مقاساتي/ }).click();
  for (const [k, v] of [['length','58'],['shoulder','19'],['sleeve','24'],['width','22'],['neck','16'],['cuff','10']]) await p.locator(`input[name=m_${k}]`).fill(v);
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
  const must = ['أحمد','+967773456789','المكلا','القماش: كوري مقلم','اللون المطلوب: أبيض','تفصيل سعودي','قلاب فرنسي','كبك رسمي','مثلث مخفي','الجيب: مشطوف','تطريز الاسم','الكمية: 2','عميل جديد – المقاسات مرفقة','المقاس (بالإنش)','الطول: 58 إنش','الرقبة: 16 إنش','أسفل اليد (الكبك): 10 إنش','قبل العيد'];
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
  await p.evaluate(() => localStorage.setItem('qs_measurement_profile_v2', JSON.stringify({ name: 'سعيد', phone: '+967771112223', city: 'المكلا', measurements: { length: '60', shoulder: '19', sleeve: '25', width: '23', neck: '17' }, savedAt: new Date().toISOString() })));
  await p.reload({ waitUntil: 'networkidle' });
  ok('صفحة المقاسات: المقاسات مخفية قبل التحقق', await p.getByTestId('measurements-locked').isVisible() && !(await p.content()).includes('>60 إنش<'));
  await p.getByLabel('رقم الجوال للتحقق').fill('770000000'); await p.getByRole('button', { name: 'تحقق' }).click();
  ok('صفحة المقاسات: رفض رقم غير مطابق', await p.getByText('الرقم لا يطابق المقاسات المحفوظة على هذا الجهاز.').isVisible());
  await p.getByLabel('رقم الجوال للتحقق').fill('771112223'); await p.getByRole('button', { name: 'تحقق' }).click();
  ok('صفحة المقاسات: عرض بعد التحقق', await p.getByText('60 إنش').isVisible());
  ok('صفحة المقاسات: توضيح مراجعة الموظف', await p.getByText('يراجع موظفنا مقاساتك المحفوظة ويؤكدها معك').isVisible());
  msg = await send(ctx, p, 'reorder-send');
  ok('إعادة الطلب تحصل على رقم QS-0004', msg.includes('رقم الطلب: QS-0004') && msg.includes('الطول: 60 إنش') && msg.includes('أرجو مراجعتها'), msg.split('\n').slice(0,2).join(' | '));
  ok('عرض رقم إعادة الطلب', (await p.getByTestId('reorder-number').textContent()).includes('QS-0004'));
  await ctx.close();

  // ── 4b. Approved options (colors, patterns, fabric types, measurements) ──
  ctx = await newCtx(b, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  p = await ctx.newPage();
  const nx = async () => { await p.evaluate(() => document.activeElement && document.activeElement.blur()); await p.waitForTimeout(200); await p.getByTestId('next-mobile').click(); await p.waitForTimeout(350); };
  await p.goto(BASE + '/design', { waitUntil: 'networkidle' }); await p.evaluate(() => sessionStorage.clear()); await p.reload({ waitUntil: 'networkidle' });
  const types = await p.getByRole('radiogroup', { name: 'نوع القماش' }).getByRole('radio').allInnerTexts();
  const wantTypes = ['قماش أبيض ياباني','سميرا أميس الصافي','كوري مقلم','صيني ممتاز','شتوي كاروهات'];
  ok('أنواع الأقمشة المعتمدة الخمسة', wantTypes.every(t => types.some(x => x.includes(t))), types.map(x => x.split('\n')[0]).join('|'));
  ok('سميرا أميس: أكثر من 20 لوناً', types.some(x => x.includes('أكثر من 20 لوناً')));
  await radio(p, 'قماش أبيض ياباني').click(); await nx();
  const jpColors = await p.getByRole('radiogroup', { name: 'اللون المطلوب' }).getByRole('radio').allInnerTexts();
  ok('القماش الأبيض الياباني: اللون الأبيض فقط', jpColors.length === 1 && jpColors[0].includes('أبيض'), jpColors.join('|'));
  await p.getByLabel('الخطوة السابقة').click(); await p.waitForTimeout(300);
  await radio(p, 'كوري مقلم').click(); await nx();
  const colors = (await p.getByRole('radiogroup', { name: 'اللون المطلوب' }).getByRole('radio').allInnerTexts()).map(x => x.trim());
  const wantColors = ['أبيض','سكري','بيج','صحراوي','رصاصي','كحلي','أسود','لون آخر'];
  ok('الألوان المعتمدة السبعة + لون آخر', wantColors.every(c => colors.includes(c)) && colors.length === 8, colors.join('|'));
  const pats = await p.getByRole('radiogroup', { name: 'النقشة' }).getByRole('radio').allInnerTexts();
  const wantPats = ['خيوط البشت','خلية النحل','خلية مع مقلم','مقلم','مخطط','كاروهات'];
  ok('النقشات المعتمدة', wantPats.every(t => pats.some(x => x.startsWith(t))), pats.map(x => x.split('\n')[0]).join('|'));
  ok('خيوط البشت: الأكثر طلباً', pats.some(x => x.includes('خيوط البشت') && x.includes('الأكثر طلباً')));
  await p.getByLabel('الخطوة السابقة').click(); await p.waitForTimeout(300);
  await radio(p, 'سميرا أميس الصافي – رقم 1').click(); await nx();
  const photoColors = await p.getByRole('radiogroup', { name: 'اللون المطلوب' }).getByRole('radio').count();
  const photoImgs = await p.getByRole('radiogroup', { name: 'اللون المطلوب' }).locator('img').count();
  ok('سميرا أميس: 20 لوناً مصوراً مرقماً + لون آخر', photoColors === 21 && photoImgs === 20, `${photoColors}/${photoImgs}`);
  await radio(p, 'كحلي (رقم 13)').click(); await radio(p, 'خيوط البشت').click(); await nx();
  await radio(p, 'تفصيل قطري').click(); await radio(p, 'رقبة صيني').click(); await nx();
  ok('خيار نص كم في الأكمام', await radio(p, 'نص كم').isVisible());
  await radio(p, 'نص كم').click(); await nx();
  await radio(p, 'مربع سحاب – بسحاب').click(); await nx();
  await radio(p, 'مخفي').click(); await nx();
  await p.getByRole('radio', { name: /عميل جديد/ }).click(); await p.getByRole('radio', { name: /سأدخل مقاساتي/ }).click();
  const labels = await p.locator('input[name^="m_"]').evaluateAll(els => els.map(e => e.closest('label').querySelector('.field-label').textContent.replace(/[*()]|اختياري/g, '').trim()));
  const wantM = ['الطول','الكتف','طول اليد','العرض','الرقبة','فتح اليد الإبط','وسط اليد','أسفل اليد الكبك'];
  ok('القياسات المعتمدة الثمانية', JSON.stringify(labels.map(l => l.replace(/\s+/g, ' '))) === JSON.stringify(wantM), labels.join('|'));
  ok('وحدة القياس إنش', (await p.locator('input[name=m_length] + span').textContent()) === 'إنش');
  for (const [k, v] of [['length','57'],['shoulder','18'],['sleeve','23'],['width','21'],['neck','15'],['armhole','9'],['midArm','7'],['cuff','5']]) await p.locator(`input[name=m_${k}]`).fill(v);
  await nx();
  await p.locator('input[name=name]').fill('ناصر'); await p.locator('input[name=phone]').fill('771234567'); await p.getByRole('radio', { name: 'خارج المكلا' }).click(); await p.locator('input[name=city]').fill('الشحر');
  await p.evaluate(() => document.activeElement && document.activeElement.blur()); await p.waitForTimeout(250);
  msg = await send(ctx, p, 'send-mobile');
  const must2 = ['القماش: سميرا أميس الصافي – رقم 1','اللون المطلوب: كحلي (رقم 13)','النقشة: خيوط البشت','تفصيل قطري','رقبة صيني','الأكمام: نص كم','مربع سحاب','الجيب: مخفي','الطول: 57 إنش','فتح اليد (الإبط): 9 إنش','وسط اليد: 7 إنش','أسفل اليد (الكبك): 5 إنش','الشحر'];
  const miss2 = must2.filter(x => !msg.includes(x));
  ok('رسالة واتساب بالخيارات المعتمدة (نقشة + 8 قياسات بالإنش)', miss2.length === 0, miss2.join(','));
  await p.goto(BASE + '/design?fabric=semiramis-pure', { waitUntil: 'networkidle' }); await p.evaluate(() => sessionStorage.clear()); await p.reload({ waitUntil: 'networkidle' });
  ok('رابط «صمم بهذا القماش» من الكتالوج يختار سميرا أميس', (await radio(p, 'سميرا أميس الصافي – رقم 1').getAttribute('aria-checked')) === 'true');
  await p.goto(BASE + '/design?fabric=honeycomb-formal', { waitUntil: 'networkidle' }); await p.evaluate(() => sessionStorage.clear()); await p.reload({ waitUntil: 'networkidle' });
  await nx();
  const hcCount = await p.getByRole('radiogroup', { name: 'اللون المطلوب' }).getByRole('radio').count();
  ok('خلية النحل في صمم ثوبك: 10 ألوان مصورة + لون آخر', hcCount === 11, String(hcCount));
  await ctx.close();

  // ── 4c. New catalog: old images removed, Japanese white photo + price data ──
  ctx = await newCtx(b, { viewport: { width: 1280, height: 900 } });
  p = await ctx.newPage();
  let oldImgs = 0;
  for (const path of ['/', '/fabrics', '/fabrics/japanese-white', '/fabrics/korean-striped', '/design']) {
    await p.goto(BASE + path, { waitUntil: 'networkidle' });
    oldImgs += await p.evaluate(() => [...document.images].filter(i => /blob\.vercel-storage|hebbkx/.test(decodeURIComponent(i.src))).length + (document.documentElement.outerHTML.match(/hebbkx1anhila5yf/g) || []).length);
  }
  ok('حذف الصور القديمة بالكامل من كل الصفحات', oldImgs === 0, String(oldImgs));
  await p.goto(BASE + '/fabrics', { waitUntil: 'networkidle' });
  const cards = await p.$$eval('article', as => as.map(a => ({ t: a.querySelector('h3')?.textContent, img: !!a.querySelector('img'), soon: a.textContent.includes('الصورة قريباً') })));
  ok('الكتالوج: 6 أقمشة', cards.length === 6, cards.map(c => c.t).join('|'));
  ok('القماش الأبيض الياباني بصورته', cards.find(c => c.t === 'قماش أبيض ياباني')?.img === true);
  ok('سميرا أميس وخلية النحل بصورهما، والباقي «الصورة قريباً»', cards.find(c => c.t === 'سميرا أميس الصافي – رقم 1')?.img === true && cards.find(c => c.t === 'خلية النحل الرسمي')?.img === true && cards.filter(c => c.soon).length === 3);
  ok('الأسعار مخفية (40,000 غير معروض)', !(await p.evaluate(() => document.body.innerText)).includes('40,000'));
  await p.goto(BASE + '/fabrics/semiramis-pure', { waitUntil: 'networkidle' });
  ok('صفحة سميرا أميس: 20 لوناً منفصلاً بأرقامها', (await p.locator('#colors-heading + p + ul li img').count()) === 20 && (await p.getByText('13 · كحلي').count()) === 1);
  await p.goto(BASE + '/fabrics/honeycomb-formal', { waitUntil: 'networkidle' });
  ok('صفحة خلية النحل الرسمي: 10 ألوان منفصلة', (await p.locator('#colors-heading + p + ul li img').count()) === 10 && (await p.getByRole('heading', { name: 'الألوان المتوفرة (10 ألوان)' }).count()) === 1 && (await p.getByText('5 · جملي').count()) === 1);
  ok('صفحة خلية النحل: السعر مخفي', !(await p.evaluate(() => document.body.innerText)).includes('40,000'));
  ok('الأسعار مخفية (80,000 غير معروض)', !(await p.evaluate(() => document.body.innerText)).includes('80,000'));
  const prodRes = await p.request.get(BASE + '/fabrics/thai-pure');
  ok('روابط الأقمشة القديمة تُرجع 404', prodRes.status() === 404, String(prodRes.status()));
  await ctx.close();

  // ── 5. Copy checks across the site ──
  ctx = await newCtx(b, { viewport: { width: 1280, height: 900 } });
  p = await ctx.newPage();
  const pagesList = ['/', '/fabrics', '/fabrics/japanese-white', '/design', '/measurements', '/about', '/contact'];
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
  for (const path of [...pagesList, '/fabrics/semiramis-pure', '/fabrics/honeycomb-formal', '/fabrics/winter-checks']) {
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
  ok('9 sitemap.xml يحتوي 12 رابطاً (6 صفحات + 6 أقمشة)', (sm.match(/<loc>/g) || []).length === 12);
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
