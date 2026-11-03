const http = require("node:http");
const path = require("node:path");
const fs = require("node:fs");

const root = __dirname;
const port = Number(process.env.PORT || 3000);
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json"
};
const publicFiles = new Set([
  "index.html", "styles.css", "app.js", "translations.js", "course-catalog.js",
  "python-worker.js", "config.js", "auth.js", "manifest.json", "sw.js", "icon.svg", "robots.txt", "404.html", "privacy.html",
  "icon-192.png", "icon-512.png", "social-preview.png"
]);

function serveStatic(request, response, pathname) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    response.writeHead(400);
    response.end("Invalid URL.");
    return;
  }
  const relativePath = decodedPath === "/" ? "index.html" : decodedPath.replace(/^\/+/, "");
  if (!publicFiles.has(relativePath)) {
    fs.readFile(path.join(root, "404.html"), (error, content) => {
      if (error) {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Not found.");
        return;
      }
      response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      response.end(content);
    });
    return;
  }
  const filePath = path.resolve(root, relativePath);
  if (!filePath.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403);
    response.end("Forbidden.");
    return;
  }
  fs.stat(filePath, (statError, stat) => {
    if (statError || !stat.isFile()) {
      response.writeHead(404);
      response.end("Not found.");
      return;
    }
    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      "Content-Length": stat.size,
      "X-Content-Type-Options": "nosniff"
    });
    if (request.method === "HEAD") {
      response.end();
      return;
    }
    fs.createReadStream(filePath).pipe(response);
  });
}

const server = http.createServer((request, response) => {
  let pathname;
  try {
    pathname = new URL(request.url, "http://localhost").pathname;
  } catch {
    response.writeHead(400);
    response.end("Invalid URL.");
    return;
  }
  serveStatic(request, response, pathname);
});

server.listen(port, () => console.log(`Python learning app listening on http://localhost:${port}`));
