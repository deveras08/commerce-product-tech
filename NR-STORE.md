# NR Clothing Sport — store v2

Static storefront (EN/ES) + Stripe Checkout through one Vercel serverless function.
Products and photos come from instagram.com/nrdsportt (captured Oct 13, 2026).
**Prices, shipping rates and policies are placeholders.** v1 is kept as `index.v1.html`.

```
index.html                      the store (all UI, EN/ES copy, settings block at the top of the script)
catalog.js                      products, prices (cents), colors, sizes, shipping, approved REVIEWS
images/                         product photos, 720×960 (captured from the Instagram feed)
api/create-checkout-session.js  POST endpoint → Stripe Checkout Session → returns its URL
lib/checkout.js                 cart validation + Stripe params (prices always come from catalog.js)
test/checkout.test.js           `npm test` — runs without keys or network
```

## What v2 adds
- Rotating offer bar, desktop mega menu, mobile menu drawer, search, language switch (EN/ES)
- Campaign hero, shop-by-category tiles, "New drops", "One set, fifteen colors" color picker, swim edit
- Shop grid with filters (category, type, size, saved items) and sorting
- Favorites (heart on every product, saved count in the header)
- Quick add (color + size without leaving the page)
- Product pages with their own link (`/#/p/sculpt-set`) for ads and DMs: gallery + zoom, color/size,
  quantity, size guide, delivery box, details accordions, "You may also like", sticky add bar on phones
- **Reviews**: star summary, rating breakdown, fit scale (runs small / true to size / runs large),
  photo reviews, filters and sorting, "Verified buyer" badge, helpful votes, and a "Write a review" form
- Bag drawer with free-shipping meter and "Pairs well with" add-ons; Stripe checkout
- Instagram grid, email signup, trust row, footer help pages (shipping, returns, size guide, privacy, terms)
- Search-engine product data (schema.org) and ad-pixel events (view item, add to cart, checkout, search, sign-up)

## Settings (top of the script in index.html)
| Setting | What it does |
|---|---|
| `preview` | Shows the preview bar and the "sample reviews" layout toggle. Set `false` at launch. |
| `checkoutMode` | `auto` = Stripe when hosted; falls back to a checkout preview if Stripe keys aren't set. |
| `whatsappUrl` / `whatsappPhone` | WhatsApp links. Add the phone (digits only) so "Write a review" opens a prefilled message. |
| `reviewEndpoint` | Optional URL that stores submitted reviews for approval (e.g. a form service). |
| `signupEndpoint` | Optional URL of the email tool. Until set, sign-ups show "not being saved yet". |
| `klarna` | `true` only after Klarna is enabled in Stripe (5.99% + 30¢ per transaction). |

Also at launch: delete the `<meta name="robots" content="noindex">` line.

## How reviews work (no fake reviews)
The store ships with **zero reviews**. Publishing invented reviews breaks the FTC rule on fake reviews
(16 CFR Part 465) and gets ad accounts flagged. The flow:
1. A customer clicks "Write a review", fills in rating, fit, size, text and photos, and confirms they bought it.
2. Without a `reviewEndpoint`, the review goes to NR on WhatsApp (prefilled when `whatsappPhone` is set).
3. NR checks it against the order, then adds it to `REVIEWS` in `catalog.js` (format is documented there),
   with `verified: true` only when it matches an order. Ratings then appear on cards, product pages and the home page.
4. Ask every customer for a review 7–10 days after delivery (email or WhatsApp). That is where reviews come from.

The "Preview the layout with sample reviews" link only exists while `preview: true`, and every sample
card is labelled "Sample" with bracketed placeholder text.

## Ad pixels
Paste the official Meta Pixel and TikTok Pixel snippets into `<head>`. The store already fires
ViewContent, AddToCart, InitiateCheckout, Search and Lead/SubmitForm. A privacy policy that discloses
the pixels must be live before running ads.

## Go live (test mode first)
1. **Stripe account must belong to the merchant (NR's business).**
2. Host on Vercel (framework: Other). Env vars: `STRIPE_SECRET_KEY` (`sk_test_…` first), `SITE_URL`,
   optionally `STRIPE_AUTOMATIC_TAX=true`. Without the key, checkout shows the preview instead of failing.
3. Test with Stripe's test card `4242 4242 4242 4242`, any future date, any CVC.
4. Stripe → Settings → Customer emails: turn on receipts. Turn on your own new-payment notifications.
5. Switch to `sk_live_…` only after the checklist below.
6. Domain: register it in NR's name (e.g. nrclothingsport.com was available on Oct 13, 2026).

## Launch checklist (blockers)
- [ ] Written OK from NR's owner to use the brand, photos and product names; decide who is merchant of record.
- [ ] Real prices for all 14 products; swim sizes; stock for Effortless, Pilates Princess, Mindful, Breath, Reform.
- [ ] Rename the "Bad Bunny" bikini (listed as "Bunny") — celebrity trademark; also gets ads rejected.
- [ ] Original photo files (these are feed captures) with model releases covering web and paid ads;
      ideally back, detail and every-color shots for each product (the gallery supports several per product via `images: []`).
- [ ] Size measurements (size guide shows `[—]`), fit notes, fabric and care, shipping times, return policy.
- [ ] Privacy policy, terms and refund policy text (Stripe activation and ad accounts look for these).
- [ ] Email tool for sign-ups (`signupEndpoint`) and a review intake (`reviewEndpoint` or WhatsApp phone).
- [ ] Sales-tax review with an accountant before enabling Stripe Tax.
- [ ] Confirm the WhatsApp link and "Made in Colombia" labels.
- [ ] No fabric/performance claims (compression, UPF, squat-proof) without the manufacturer's spec sheet.

## Known limits
- No inventory: every size/color is buyable. No order webhook: orders live in the Stripe Dashboard.
- Online checkout is US-only; Dominican Republic orders go to WhatsApp.
- Favorites and bag are saved per browser (no customer accounts).
