const fs = require("node:fs");
const path = require("node:path");

const outputDirectory = process.env.VERCEL_OUTPUT_DIR || path.join(__dirname, "dist");
const publicFiles = [
  "index.html", "learn.html", "platform.css", "platform.js", "local-auth.js",
  "styles.css", "app.js", "translations.js", "course-catalog.js", "python-worker.js",
  "config.js", "auth.js", "manifest.json", "sw.js", "icon.svg", "robots.txt",
  "404.html", "privacy.html", "icon-192.png", "icon-512.png", "social-preview.png"
];
if (process.env.VERCEL_ENV && /authProvider:\s*["']local["']/.test(fs.readFileSync(path.join(__dirname, "config.js"), "utf8"))) {
  throw new Error("Local SQLite auth requires the Node server. Configure working Supabase auth before static Vercel deployment. See PLATFORM.md.");
}
fs.mkdirSync(outputDirectory, { recursive: true });
for (const file of publicFiles) fs.copyFileSync(path.join(__dirname, file), path.join(outputDirectory, file));
const indexPath = path.join(outputDirectory, "index.html");
const environment = process.env.VERCEL_ENV;
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

if (!environment) {
  console.log("Public assets built in dist. Local registration requires npm start (Node server).");
  process.exit(0);
}

if (environment === "production" && !productionHost) {
  throw new Error("Vercel did not provide a production domain for SEO metadata.");
}

let html = fs.readFileSync(indexPath, "utf8");

function setHeadTag(pattern, tag) {
  if (pattern.test(html)) {
    html = html.replace(pattern, tag);
  } else {
    html = html.replace("</head>", `  ${tag}\n  </head>`);
  }
}

if (environment === "production") {
  const host = productionHost.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  const siteUrl = `https://${host}`;
  const imageUrl = `${siteUrl}/social-preview.png`;
  setHeadTag(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i, `<link rel="canonical" href="${siteUrl}/">`);
  setHeadTag(/<meta\b(?=[^>]*\bproperty=["']og:url["'])[^>]*>/i, `<meta property="og:url" content="${siteUrl}/">`);
  setHeadTag(/<meta\b(?=[^>]*\bproperty=["']og:image["'])[^>]*>/i, `<meta property="og:image" content="${imageUrl}">`);
  setHeadTag(/<meta\b(?=[^>]*\bname=["']twitter:image["'])[^>]*>/i, `<meta name="twitter:image" content="${imageUrl}">`);
  html = html.replace(/\s*<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/i, "");
} else {
  setHeadTag(/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/i, '<meta name="robots" content="noindex, nofollow">');
}

fs.writeFileSync(indexPath, html);
console.log(`Generated ${environment} deployment metadata.`);
