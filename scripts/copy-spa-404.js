/**
 * GitHub Pages serves static files only. Direct URLs like /RentBasket_Website/catalog
 * have no physical file — GitHub returns 404.html. Copying index.html lets React Router
 * handle the path on load.
 * @see https://github.com/rafgraph/spa-github-pages
 */
import { copyFileSync, existsSync } from "fs";
import { join } from "path";

const indexPath = join(process.cwd(), "dist", "index.html");
const notFoundPath = join(process.cwd(), "dist", "404.html");

if (!existsSync(indexPath)) {
  console.error("copy-spa-404: dist/index.html not found — run vite build first");
  process.exit(1);
}

// Prefer full app shell (assets match index.html). public/404.html redirect is fallback if missing.
copyFileSync(indexPath, notFoundPath);
console.log("copy-spa-404: wrote dist/404.html (SPA shell) for GitHub Pages");
