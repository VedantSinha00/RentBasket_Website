# RentBasket API Contract

Base URL: `https://testapi.rentbasket.com`

All endpoints except `/get-jwt-token` require:
```
Authorization: Bearer <jwt_token>
```

---

## Auth

### `POST /get-jwt-token`
Payload: `{ "app_key": "base64:/mIAk2D0P+xn5OHNwyvk1JjaR3uABCOmw5hBGxQGLTk=" }`
Response: `{ "status": "success", "responseCode": 200, "data": { "messageDescription": "...", "jwt_token": "..." } }`

---

## Catalog / Products

### `GET /get-amenity-category`
Fetch all top-level categories (Furniture, Appliances, etc.)

### `GET /get-subcategories-by-category?category_id=1`
Fetch subcategories for a given category (Bed, Sofa, Chair, etc.)

### `GET /get-amenity-types-by-subcategory?subcategory_id=1`
Fetch all products in a subcategory.
Response shape: `{ "data": { "items": [...], "filter_tags": "..." } }`

Product item shape:
```json
{
  "amenity_type_id": 28,
  "amenity_type_name": "Wooden Single Bed 6x3 Basic",
  "prod_description": "..." | null,
  "small_image_path": "https://...",
  "large_image_path": "https://...",
  "rent_3": 700,
  "rent_6": 560,
  "rent_9": 420,
  "rent_12": 420,
  "rent_01d": 588,
  "rent_08d": 882,
  "rent_15d": 1260,
  "rent_30d": 840,
  "rent_60d": 2065,
  "security_short_term": 1400,
  "percent_discount": 30,
  "adv_security": 1000 | null,
  "security_multiple": 2,
  "in_stock": 1,
  "is_trending": 0 | 1,
  "length": null,
  "breadth": null,
  "height": null,
  "color": null,
  "offer_key": "",
  "in_offer": 0
}
```

`in_stock` values: `1` = In Stock, `2` = Out of Stock, `0` = DB error (treat as In Stock)

### `GET /get-product-details?product_id=11774`
Fetch a single product by ID.

---

## Cart

### `POST /add-to-proposal-for-lead`
Payload:
```json
{ "user_id": "903000010001", "amenity_type_id": 28, "count": 1, "rent": 294, "duration": 12, "security": 588, "lead_id": "4339" }
```
Add a product to the cart.

### `POST /update-proposal-cart`
Payload:
```json
{ "user_id": "903000010001", "amenity_type_id": 28, "count": 2, "lead_id": "4339" }
```
Update quantity in cart.

### `POST /remove-from-proposal-cart`
Payload:
```json
{ "user_id": "903000010001", "amenity_type_id": 1089, "count": 0, "rent": 359.1, "duration": 6 }
```
Remove item from cart.

### `GET /get-proposal-cart-items-for-lead?lead_id=4339`
Fetch all items in the cart for a given lead.

### `POST /confirm-proposal-for-tenant`
Payload:
```json
{ "user_id": "903000010001", "cart_items": [{ "cart_item_id": 10465, "coupon_list": [] }], "lead_id": "4339" }
```
Confirm the cart and proceed to payment. This is the step immediately before the payment process.
