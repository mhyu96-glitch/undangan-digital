import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = join(process.cwd(), 'dist');
const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 5173);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

const getFilePath = (url) => {
  const pathname = decodeURIComponent(new URL(url, `http://${host}:${port}`).pathname);
  const requested = normalize(join(root, pathname));

  if (!requested.startsWith(root)) return join(root, 'index.html');
  if (existsSync(requested) && statSync(requested).isFile()) return requested;

  const indexPath = join(requested, 'index.html');
  if (existsSync(indexPath)) return indexPath;

  return join(root, 'index.html');
};

createServer((request, response) => {
  const filePath = getFilePath(request.url || '/');
  response.setHeader('Content-Type', contentTypes[extname(filePath)] || 'application/octet-stream');
  createReadStream(filePath).pipe(response);
}).listen(port, host, () => {
  console.log(`Serving dist at http://${host}:${port}/`);
});
