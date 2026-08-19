import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

const PORT = Number(process.env.PORT || 4230);
const ROOT = process.cwd();

const MIME = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(requestUrl.pathname);

  if (pathname === '/') {
    pathname = '/index.html';
  }

  const safePath = path.normalize(pathname).replace(/^([.][.](?:[/\\]))+/, '');
  const filePath = path.join(ROOT, safePath);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  try {
    const ext = path.extname(filePath);
    const headers = {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    };
    const data = await fs.readFile(filePath);
    res.writeHead(200, headers);
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Tag Soup Kitchen serving at http://localhost:${PORT}/`);
});
