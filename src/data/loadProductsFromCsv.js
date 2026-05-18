/**
 * CSV catalog loader — for adding new products without editing products.js.
 *
 * NOT wired into the live catalog yet. The app still uses the static array
 * in products.js. When ready, merge in Catalog.jsx:
 *   import { loadProductsFromCsv } from "@/data/loadProductsFromCsv";
 *   const csvProducts = await loadProductsFromCsv();
 *   const allProducts = [...products, ...csvProducts];
 */
import catalogCsv from "./products-catalog.csv?raw";
import { DURATION_OPTIONS } from "./products";

const PRICING_KEYS = DURATION_OPTIONS.map((d) => d.key);

const assetUrlByPath = Object.fromEntries(
  Object.entries(
    import.meta.glob("@/assets/**/*.{png,jpg,jpeg,webp}", {
      eager: true,
      import: "default",
    }),
  ).map(([modulePath, url]) => {
    const normalized = modulePath.replace(/^@/, "/src");
    return [normalized, url];
  }),
);

/** Parse a single CSV line respecting quoted fields */
function parseCsvLine(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  fields.push(current);
  return fields;
}

function splitList(value, sep = "|") {
  if (!value?.trim()) return [];
  return value.split(sep).map((s) => s.trim()).filter(Boolean);
}

function parseSpecifications(raw) {
  const specs = {};
  splitList(raw).forEach((pair) => {
    const eq = pair.indexOf("=");
    if (eq === -1) return;
    specs[pair.slice(0, eq).trim()] = pair.slice(eq + 1).trim();
  });
  return specs;
}

function parseFeatures(raw) {
  return splitList(raw).map((pair) => {
    const eq = pair.indexOf("=");
    if (eq === -1) return { icon: "Star", label: pair };
    return { icon: pair.slice(0, eq).trim(), label: pair.slice(eq + 1).trim() };
  });
}

function resolveImage(imagePath) {
  const normalized = imagePath?.startsWith("/src")
    ? imagePath
    : `/src${imagePath?.startsWith("/") ? "" : "/"}${imagePath || ""}`;
  return assetUrlByPath[normalized] || assetUrlByPath["/src/assets/Furniture/1.png"];
}

function rowToProduct(row) {
  const get = (key) => row[key] ?? "";

  const pricing_by_duration = {};
  PRICING_KEYS.forEach((key) => {
    const col = `price_${key}`;
    const val = Number(get(col));
    if (!Number.isNaN(val) && get(col) !== "") {
      pricing_by_duration[key] = val;
    }
  });

  const subcategory = get("subcategory").trim();
  const imagePath = get("image_path").trim();
  const image = resolveImage(imagePath);

  return {
    id: get("id").trim(),
    category: get("category").trim(),
    subcategory: subcategory || null,
    name: get("name").trim(),
    subtitle: get("subtitle").trim(),
    image,
    images: [image],
    short_description: get("short_description").trim(),
    tags: splitList(get("tags")),
    rating: Number(get("rating")) || 0,
    review_count: Number(get("review_count")) || 0,
    pricing_by_duration,
    deposit: Number(get("deposit")) || 0,
    stock_status: get("stock_status").trim() || "in_stock",
    best_for: splitList(get("best_for")),
    specifications: parseSpecifications(get("specifications")),
    features: parseFeatures(get("features")),
    whats_included: splitList(get("whats_included")),
    rental_terms: get("rental_terms").trim(),
    care_support: get("care_support").trim(),
    related_product_ids: splitList(get("related_product_ids")),
    _source: "csv",
  };
}

/**
 * Parse products-catalog.csv into product objects matching products.js shape.
 * @returns {import('./products').default extends Array<infer P> ? P[] : object[]}
 */
export function parseProductsCatalogCsv(csvText = catalogCsv) {
  const lines = csvText
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.trim());

  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row = headers.reduce((acc, header, i) => {
      acc[header] = values[i] ?? "";
      return acc;
    }, {});
    return rowToProduct(row);
  });
}

/** Ready for future use — does not run in production until explicitly imported */
export function loadProductsFromCsv() {
  return Promise.resolve(parseProductsCatalogCsv());
}

export default loadProductsFromCsv;
