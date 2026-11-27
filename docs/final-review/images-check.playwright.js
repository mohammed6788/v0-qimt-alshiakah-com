const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
const bad = []; let total = 0;
p.on('response', r => { if (r.status() >= 400 && /\.(webp|png|jpg|jpeg|svg)|_next\/image/.test(r.url())) bad.push(r.status() + ' ' + r.url()); });
const slugs = ['japanese-white','semiramis-pure','korean-striped','chinese-premium','winter-checks','honeycomb-formal','honeycomb-striped','bisht-threads'];
for (const path of ['/', '/fabrics', '/design', '/measurements', '/about', '/contact', ...slugs.map(s => '/fabrics/' + s), ...slugs.map(s => '/design?fabric=' + s)]) {
  await p.goto('http://localhost:3100' + path, { waitUntil: 'networkidle' });
  if (path.startsWith('/design?')) { await p.getByTestId('send-desktop').count(); await p.getByRole('button', { name: /^التالي/ }).click(); await p.waitForTimeout(600); }
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
  await p.waitForTimeout(500);
  const r = await p.evaluate(() => [...document.images].map(i => ({ src: i.currentSrc || i.src, ok: i.complete && i.naturalWidth > 0 })));
  total += r.length; r.filter(x => !x.ok).forEach(x => bad.push('broken ' + path + ' ' + x.src));
}
const fs = require('fs'); const files = fs.readdirSync('/home/user/v0-qimt-alshiakah-com/public/fabrics', { recursive: true }).filter(f => f.endsWith('.webp'));
console.log('images checked:', total, '| fabric files on disk:', files.length, '| problems:', bad.length); bad.slice(0, 10).forEach(x => console.log(' ', x));
await b.close(); })();
