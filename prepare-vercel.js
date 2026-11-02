const fs = require("node:fs");
const path = require("node:path");

const outputDirectory = process.env.VERCEL_OUTPUT_DIR || __dirname;
const indexPath = path.join(outputDirectory, "index.html");
const environment = process.env.VERCEL_ENV;
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

if (!environment) {
  console.log("Vercel environment not detected; leaving static metadata unchanged.");
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
