const { chromium } = require('playwright');
const pages = ['/', '/fabrics', '/fabrics/japanese-white', '/design', '/measurements', '/about', '/contact', '/nope-404'];
const results = []; const ok = (n, c, x='') => results.push([c?'PASS':'FAIL', n, x]);
(async () => {
  const b = await chromium.launch();
  for (const [w, label] of [[375,'جوال'],[1440,'كمبيوتر']]) {
    const desk = w >= 768;
    const p = await (await b.newContext({ viewport: { width: w, height: 900 } })).newPage();
    for (const path of pages) {
      await p.goto('http://localhost:3100' + path, { waitUntil: 'networkidle' });
      await p.evaluate(() => document.fonts.ready);
      const r = await p.evaluate(() => {
        const vis = [...document.querySelectorAll('body *')].filter(el => el.childNodes.length && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && el.getBoundingClientRect().width > 0 && !el.closest('svg'));
        const weights = new Set(), families = new Set(); let spaced = [];
        for (const el of vis) { const cs = getComputedStyle(el); weights.add(cs.fontWeight); families.add(cs.fontFamily.split(',')[0].replace(/["']/g,'').trim());
          if (/[؀-ۿ]/.test(el.textContent) && cs.letterSpacing !== 'normal' && parseFloat(cs.letterSpacing) !== 0) spaced.push(el.textContent.trim().slice(0,20)); }
        const sz = (sel) => [...document.querySelectorAll(sel)].map(e => [parseFloat(getComputedStyle(e).fontSize), getComputedStyle(e).fontWeight, +(parseFloat(getComputedStyle(e).lineHeight)/parseFloat(getComputedStyle(e).fontSize)).toFixed(2)]);
        const fontFaces = []; for (const ss of document.styleSheets) { try { for (const r of ss.cssRules) if (r instanceof CSSFontFaceRule) fontFaces.push([r.style.fontFamily, r.style.fontWeight, r.style.fontDisplay]); } catch {} }
        const loaded = [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight);
        return { weights: [...weights], families: [...families], spaced, hero: sz('.type-hero'), h1: sz('h1:not(.type-hero)'), h2: sz('.type-h2'), h3: sz('.type-h3'), body: parseFloat(getComputedStyle(document.body).fontSize), overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth, fontFaces, loaded };
      });
      const tag = `${label} ${path}`;
      ok(`${tag}: خط واحد IBM Plex Sans Arabic`, r.families.every(f => /IBM Plex Sans Arabic|plexArabic|Plex/i.test(f)), r.families.join('|'));
      ok(`${tag}: الأوزان ضمن 400/500/600/700`, r.weights.every(x => ['400','500','600','700'].includes(x)), r.weights.join(','));
      ok(`${tag}: لا تباعد حروف في العربية`, r.spaced.length === 0, r.spaced.slice(0,3).join('|'));
      ok(`${tag}: Body 16px`, r.body === 16);
      ok(`${tag}: بدون تمرير أفقي`, !r.overflow);
      if (r.hero.length) ok(`${tag}: Hero ${desk?36:28}px/700`, r.hero.every(([s,wt]) => s === (desk?36:28) && wt === '700'), JSON.stringify(r.hero));
      if (r.h1.length) ok(`${tag}: H1 ${desk?32:26}px/700`, r.h1.every(([s,wt]) => s === (desk?32:26) && wt === '700'), JSON.stringify(r.h1));
      if (r.h2.length) ok(`${tag}: H2 ${desk?26:22}px/700`, r.h2.every(([s,wt]) => s === (desk?26:22) && wt === '700'), JSON.stringify(r.h2[0]));
      if (r.h3.length) ok(`${tag}: H3 ${desk?22:19}px/600`, r.h3.every(([s,wt]) => s === (desk?22:19) && wt === '600'), JSON.stringify(r.h3[0]));
      if (path === '/' && w === 375) {
        const plex = r.fontFaces.filter(f => /Plex/i.test(f[0]) && !/Fallback/i.test(f[0]));
        ok('font-display: swap لكل ملفات الخط', plex.length > 0 && plex.every(f => f[2] === 'swap'), plex.length + ' faces');
        ok('الأوزان المحمّلة 400/500/600/700 فقط', [...new Set(plex.map(f => f[1]))].sort().join(',') === '400,500,600,700', [...new Set(plex.map(f => f[1]))].join(','));
        ok('لا خطوط أخرى (Tajawal/Geist)', !r.fontFaces.some(f => /Tajawal|Geist/i.test(f[0])));
      }
    }
  }
  await b.close();
  const fails = results.filter(r => r[0]==='FAIL');
  for (const r of fails) console.log(r.join(' — '));
  console.log(`${results.length - fails.length}/${results.length} passed`);
})();
