import { createServer } from "http";
import { readFile } from "fs/promises";
import { join, extname } from "path";

const PORT = process.env.PORT || 3000;
const DIST = join(import.meta.dirname, "apps/demo/dist");

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = createServer(async (req, res) => {
  let filePath = join(DIST, req.url === "/" ? "index.html" : req.url);

  try {
    const stat = await readFile(filePath);
    const ext = extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(stat);
  } catch {
    const index = await readFile(join(DIST, "index.html"));
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(index);
  }
});

server.listen(PORT, () => {
  console.log(`Michi demo running on http://localhost:${PORT}`);
});
