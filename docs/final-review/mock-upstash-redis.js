// Minimal Upstash-compatible REST mock (pipeline endpoint) for local tests.
const http = require('http');
const db = new Map();
http.createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/pipeline' || req.headers.authorization !== 'Bearer test-token') { res.writeHead(401); return res.end('[]'); }
  let body = ''; req.on('data', c => body += c); req.on('end', () => {
    const out = JSON.parse(body).map(([cmd, ...a]) => {
      cmd = cmd.toUpperCase();
      if (cmd === 'INCR') { const v = (Number(db.get(a[0])) || 0) + 1; db.set(a[0], v); return { result: v }; }
      if (cmd === 'EXPIRE') return { result: 1 };
      if (cmd === 'HSET') { const h = db.get(a[0]) || {}; for (let i = 1; i < a.length; i += 2) h[a[i]] = a[i+1]; db.set(a[0], h); return { result: (a.length-1)/2 }; }
      if (cmd === 'DUMP_ALL') return { result: Object.fromEntries(db) };
      return { error: 'ERR unknown' };
    });
    res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(out));
  });
}).listen(8079, () => console.log('mock redis on 8079'));
