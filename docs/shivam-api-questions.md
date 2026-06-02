# API Questions — RentBasket Frontend Integration

## 1. 1-Month Pricing (`rent_1`)

The sample data has `rent_3`, `rent_6`, `rent_9`, and `rent_12` but no `rent_1`. The site's default duration selector starts at 1 month. Can you add `rent_1` to the product response?

---

## 2. Category and Subcategory Names

The product data only contains `category_id` and `subcategory_id` as integers. The catalog page filters by category name (e.g. "Furniture", "Appliances", "Washing Machines").

Two options — whichever is easier on your end:
- Add `category_name` and `subcategory_name` strings directly to each product in the response, or
- Provide a separate `/categories` endpoint that maps IDs to names.

---

## 3. Related Products

There is no related product field in the current data. The site shows a "You may also like" section on the product detail page and cross-sell suggestions in the cart.

Can you either:
- Add a `related_ids` array to each product in the response, or
- Provide a `/products/{id}/related` endpoint?

---

## 4. Product Descriptions and Content

The current data has no descriptive content — no subtitle, short description, specifications, feature highlights, what's included, rental terms, or support/maintenance text. These are shown on the product detail page.

Do you have an endpoint that returns this content per product, or is this something we need to manage on our side? If there's an endpoint, please share the URL and response shape.

---

## 5. Ratings and Reviews

No `rating` or `review_count` in the sample data. These are displayed on both the catalog card and the product detail page.

Is this available from any endpoint? If not, should we remove it from the UI for now?

---

## 6. `adv_security` Data Quality

Several products in the sample have `adv_security: 2` — for example:
- Upholstered Double Bed Queen Non Storage (rent ₹1119/mo)
- 3-Seater Fabric Sofa (rent ₹1372/mo)
- Multiple dining tables

A deposit of ₹2 on a ₹1100+/mo item looks like a data entry error rather than an intentional value. Two questions:
- Is this a known issue that will be cleaned up before the API goes live?
- In the meantime, should we use `adv_security` directly, or fall back to `security_multiple × rent` when the value seems wrong?

This matters for accurate deposit display — we don't want to show the wrong amount to customers.

---

## 7. `in_stock` Value of 2

Most products have `in_stock: 0` or `in_stock: 1`, but the Semi Automatic Washing Machine has `in_stock: 2`. Is this a stock quantity (2 units available), or does it represent a different status? What are all possible values and what does each mean?

---

## 8. Single Product Endpoint

Is there a `GET /products/{id}` endpoint for fetching one product by ID? Or does the frontend always fetch the full `/products` list and filter client-side?

---

## 9. Cart Sync Endpoint

We have the cart sync scaffolded on the frontend and are waiting on the contract. Please share:
- HTTP method and full URL
- Request body shape (what fields does it expect?)
- Response shape on success and on error
- Is the cart identified by an anonymous session ID (no login needed), or does it require a user account?

---

## 10. Authentication and CORS

- Does the products API (`GET /products`, etc.) require an auth token, or is it publicly accessible?
- Will CORS be configured to allow requests from our production domain and `localhost:8080` for local development?

---

## 11. API Base URL

What base URL should we set for `VITE_API_BASE_URL`? (e.g. `https://api.rentbasket.com/v2`)

---

## 12. Coupons

Is coupon validation in scope for V1? If yes, please share the endpoint URL and request/response shape.

---

Thanks — once I have answers to 2, 3, 4, and 6 in particular I can start the full build. The rest I can work around in the meantime.
