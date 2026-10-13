# commerce-product-tech
Sample product webpage creation and publishing to Vercel. Template-based system for building ecommerce product pages.

## Current deployment: NR Clothing Sport store (v2)
The site at the root of this repo is the NR Clothing Sport storefront: static `index.html` + `catalog.js`,
with Stripe Checkout through `api/create-checkout-session.js` (Vercel serverless function).
Settings, reviews workflow and the launch checklist: [NR-STORE.md](NR-STORE.md).

Run the checkout tests: `npm install && npm test`.
