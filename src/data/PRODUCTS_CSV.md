# Product catalog CSV

Add new rental SKUs in **`products-catalog.csv`** (same folder as `products.js`) instead of hand-editing the large `products` array.

## Column reference

| Column | Required | Example |
|--------|----------|---------|
| `id` | Yes | `demo-microwave-01` |
| `category` | Yes | `Appliances` |
| `subcategory` | No | `Microwaves` |
| `name` | Yes | `Demo Convection Microwave` |
| `subtitle` | Yes | Short marketing line |
| `image_path` | Yes | `/src/assets/Appliances/14.png` |
| `short_description` | Yes | Card blurb |
| `tags` | No | `Demo\|Bestseller` (pipe-separated) |
| `rating` | Yes | `4.4` |
| `review_count` | Yes | `12` |
| `price_1_day` … `price_36_months` | Yes* | Monthly rent in ₹ (*all duration columns from `DURATION_OPTIONS`) |
| `deposit` | Yes | `800` |
| `stock_status` | Yes | `in_stock` |
| `best_for` | No | `Bachelors\|Daily use` |
| `specifications` | No | `Capacity=20L\|Type=Convection` |
| `features` | No | `Zap=Quick Heat\|Minimize2=Compact` |
| `whats_included` | No | Pipe-separated list |
| `rental_terms` | Yes | Plain text |
| `care_support` | Yes | Plain text |
| `related_product_ids` | No | `wm-top-load-01\|fridge-single-01` |

## Demo rows

Two test products are included: `demo-microwave-01` and `demo-side-table-01`.

## Wiring into the app (later)

The live site still uses **`products.js` only**. To merge CSV products when you are ready:

```js
import products from "@/data/products";
import { loadProductsFromCsv } from "@/data/loadProductsFromCsv";

const csvProducts = await loadProductsFromCsv();
const allProducts = [...products, ...csvProducts];
```

Parser: `loadProductsFromCsv.js`.
