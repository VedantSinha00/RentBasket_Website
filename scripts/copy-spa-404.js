/**
 * GitHub Pages is static-only. Without real files, /catalog returns HTTP 404
 * (even when 404.html loads the SPA). This script:
 * 1. Copies index.html → 404.html (fallback for unknown paths)
 * 2. Copies index.html → <route>/index.html (HTTP 200 for known routes)
 * 3. Appends the AEO location/category page URLs to public/sitemap.xml's
 *    build output, so that list never drifts from the data files it's
 *    derived from.
 * @see https://github.com/rafgraph/spa-github-pages
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const SITE_URL = "https://home.rentbasket.com";

const distDir = join(process.cwd(), "dist");
const indexPath = join(distDir, "index.html");

if (!existsSync(indexPath)) {
  console.error("copy-spa-404: dist/index.html not found — run vite build first");
  process.exit(1);
}

function writeRouteIndex(...segments) {
  const dir = join(distDir, ...segments);
  mkdirSync(dir, { recursive: true });
  const target = join(dir, "index.html");
  copyFileSync(indexPath, target);
  return target;
}

// SPA fallback (product deep-links, typos, etc.)
copyFileSync(indexPath, join(distDir, "404.html"));

// Static routes — GitHub Pages serves these with HTTP 200
const staticRoutes = [
  "catalog",
  "catalogue",
  "basket",
  "cart", // legacy — SPA client-redirects /cart → /basket
  "checkout",
  "order-success",
  "terms-n-conditions",
  "shipping-returns",
  "faqs",
  "about",
  "contact",
];

for (const route of staticRoutes) {
  writeRouteIndex(route);
}

// Product detail pages
const productsSource = readFileSync(
  join(process.cwd(), "src", "data", "products.js"),
  "utf8"
);
const productIds = [
  ...productsSource.matchAll(/^\s+id:\s*"([^"]+)"/gm),
].map((m) => m[1]);

for (const id of productIds) {
  writeRouteIndex("product", id);
}

// Location landing pages (dynamic :citySlug route — enumerate from data file)
const locationsSource = readFileSync(
  join(process.cwd(), "src", "data", "locations.js"),
  "utf8"
);
const locationSlugs = [
  ...locationsSource.matchAll(/^\s+slug:\s*"([^"]+)"/gm),
].map((m) => m[1]);

for (const slug of locationSlugs) {
  writeRouteIndex("rent-in", slug);
}

// Product category landing pages (dynamic :categorySlug route)
const productCategoriesSource = readFileSync(
  join(process.cwd(), "src", "data", "productCategories.js"),
  "utf8"
);
const categorySlugs = [
  ...productCategoriesSource.matchAll(/^\s+slug:\s*"([^"]+)"/gm),
].map((m) => m[1]);

for (const slug of categorySlugs) {
  writeRouteIndex("rent", slug);
}

// Blog posts (dynamic :slug route)
const blogPostsSource = readFileSync(
  join(process.cwd(), "src", "data", "blogPosts.js"),
  "utf8"
);
const blogSlugs = [
  ...blogPostsSource.matchAll(/^\s+slug:\s*"([^"]+)"/gm),
].map((m) => m[1]);

for (const slug of blogSlugs) {
  writeRouteIndex("blog", slug);
}

// Regenerate the AEO section of the sitemap so it can't drift from the data
// files above. Static/core page entries live in the sitemap source file
// itself and are preserved as-is.
const sitemapPath = join(process.cwd(), "public", "sitemap.xml");
if (existsSync(sitemapPath)) {
  let sitemap = readFileSync(sitemapPath, "utf8");
  const aeoUrls = [
    ...locationSlugs.map(
      (slug) =>
        `  <url>\n    <loc>${SITE_URL}/rent-in/${slug}/</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`
    ),
    ...categorySlugs.map(
      (slug) =>
        `  <url>\n    <loc>${SITE_URL}/rent/${slug}/</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`
    ),
    ...blogSlugs.map(
      (slug) =>
        `  <url>\n    <loc>${SITE_URL}/blog/${slug}/</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>`
    ),
  ].join("\n");
  sitemap = sitemap.replace(
    /<!-- AEO-GENERATED-START -->[\s\S]*<!-- AEO-GENERATED-END -->/,
    `<!-- AEO-GENERATED-START -->\n${aeoUrls}\n  <!-- AEO-GENERATED-END -->`
  );
  writeFileSync(join(distDir, "sitemap.xml"), sitemap);
}

console.log(
  `copy-spa-404: wrote 404.html + ${staticRoutes.length} routes + ${productIds.length} product pages + ${locationSlugs.length} location pages + ${categorySlugs.length} category pages + ${blogSlugs.length} blog posts`
);
