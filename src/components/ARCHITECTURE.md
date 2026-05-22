# Component Architecture — RentBasket Website

<!-- Read before adding a new component or page. -->

## Tree Overview

```
src/
├── App.jsx                  # Router root. Route registration lives here.
├── main.jsx                 # Vite entry point. Mounts App.
├── index.css                # Global styles, HSL tokens, utility classes.
│
├── pages/                   # One file per route. Thin orchestrators — compose components, no business logic.
│   ├── Index.jsx            # / → homepage
│   ├── Catalog.jsx          # /catalog → product grid + filters
│   ├── ProductDetails.jsx   # /product/:id → single product
│   ├── Cart.jsx             # /cart → cart review
│   ├── Checkout.jsx         # /checkout → multi-step form
│   ├── OrderSuccess.jsx     # /order-success → confirmation
│   └── NotFound.jsx         # * → 404
│
├── components/
│   ├── ui/                  # shadcn/ui-style primitives. Touch only for upgrades.
│   │   ├── button.jsx
│   │   ├── toast.jsx / toaster.jsx / sonner.jsx
│   │   └── tooltip.jsx
│   │
│   ├── catalog/             # Catalog page components
│   │   ├── CatalogHero.jsx      # Hero banner for catalog page
│   │   ├── CategoryTabs.jsx     # Furniture/Appliances/Bestsellers tabs
│   │   ├── FilterBar.jsx        # Sort/filter controls
│   │   ├── ProductCard.jsx      # Individual product card (used in grid)
│   │   ├── ProductGrid.jsx      # Grid of ProductCards
│   │   ├── TrustBenefits.jsx    # Trust badges below grid
│   │   └── CatalogCTA.jsx       # Bottom CTA section
│   │
│   ├── product/             # Product detail components
│   │   ├── Breadcrumb.jsx
│   │   ├── ProductGallery.jsx   # Photo gallery / image carousel
│   │   ├── ProductInfo.jsx      # Name, description, category badge
│   │   ├── DurationSelector.jsx # Duration picker (tabs) — drives PricingSummary
│   │   ├── PricingSummary.jsx   # Shows price for selected duration
│   │   ├── AddToCartBlock.jsx   # CTA block (Add to Basket + Proceed)
│   │   ├── ProductTabs.jsx      # Details / Specs / FAQ tabs
│   │   ├── ProductFeatures.jsx  # Feature bullet points
│   │   ├── ProductFAQ.jsx       # Accordion FAQ
│   │   ├── RelatedProducts.jsx  # Carousel of related items
│   │   └── StickyMobileCTA.jsx  # Fixed bottom bar on mobile
│   │
│   ├── cart/                # Cart page components
│   │   ├── CartHeader.jsx
│   │   ├── CartItemCard.jsx     # Single cart item (quantity, remove)
│   │   ├── CartItemsList.jsx    # List of CartItemCards
│   │   ├── OrderSummary.jsx     # Right-side summary panel
│   │   ├── CrossSellStrip.jsx   # "You might also like" strip
│   │   ├── EmptyCart.jsx        # Empty state
│   │   └── StickyCheckoutBar.jsx # Mobile sticky checkout CTA
│   │
│   ├── checkout/            # Checkout page components
│   │   ├── CheckoutHeader.jsx
│   │   ├── CheckoutProgress.jsx # Step indicator (1 → 2 → 3)
│   │   ├── CheckoutForm.jsx     # Address / schedule form
│   │   ├── CheckoutPayment.jsx  # Payment section
│   │   └── CheckoutSummary.jsx  # Order summary panel
│   │
│   ├── success/             # Order success page components
│   │   ├── SuccessHero.jsx
│   │   ├── BookingSummary.jsx
│   │   ├── NextSteps.jsx
│   │   └── SuccessSupport.jsx
│   │
│   ├── Header.jsx           # Global nav (all pages)
│   ├── Footer.jsx           # Global footer (all pages)
│   ├── HeroSection.jsx      # Homepage hero
│   ├── HowItWorks.jsx       # Homepage section
│   ├── FurnitureGallery.jsx # Homepage gallery
│   ├── Testimonials.jsx     # Homepage testimonials
│   ├── WhatMakesDifferent.jsx
│   ├── FreeBenefits.jsx
│   ├── FreeServices.jsx
│   ├── MythOrFact.jsx
│   ├── FoundersSection.jsx
│   ├── DownloadSection.jsx
│   ├── ResponsibilitySection.jsx
│   └── FloatingCallButton.jsx # Fixed WhatsApp/call CTA
│
├── context/
│   └── CartContext.jsx      # Cart state (add/remove/quantity/total). See docs/business-rules.md.
│
├── hooks/
│   └── use-mobile.jsx       # Returns true when viewport < 768 px
│
├── data/
│   ├── products.js          # SOURCE OF TRUTH for all product data + DURATION_OPTIONS
│   ├── products-catalog.csv # CSV input (used by loadProductsFromCsv.js)
│   ├── loadProductsFromCsv.js
│   └── PRODUCTS_CSV.md      # Notes on CSV → JS pipeline
│
└── assets/                  # Images, videos, SVGs. Organised by category.
    ├── Furniture/
    ├── Appliances/
    ├── Bestsellers/
    ├── Home/
    └── Others/
```

## Conventions

1. **Pages are orchestrators.** No business logic in pages — compose components, pass props.
2. **Components are feature-scoped.** A `catalog/` component is never used in `checkout/`.
   Shared components (Header, Footer) live directly in `components/`.
3. **State lives at the lowest common ancestor** — or in CartContext if it crosses routes.
4. **New route = update three places:** `App.jsx` (Route), `scripts/copy-spa-404.js`
   (staticRoutes or productIds), and `docs/features.md` (new feature entry).
5. **Framer Motion:** wrap animation in the component that needs it. Don't lift animation
   state to pages. See `docs/design-system.md § Animation Budget`.
