// Pure checkout logic (no network) — validated cart -> Stripe Checkout Session params.
// Kept separate from the API handler so it can be unit-tested without Stripe keys.
const { CATALOG, SHIPPING, CURRENCY } = require('../catalog.js');

const BY_ID = new Map(CATALOG.map((p) => [p.id, p]));
const MAX_LINES = 20;
const MAX_QTY = 10;

/**
 * Validate the cart sent by the browser. The browser only sends WHAT it wants
 * (product id, color index, size, quantity) — never prices.
 * @returns {{ok:true, lines:Array} | {ok:false, error:string}}
 */
function validateItems(items) {
  if (!Array.isArray(items) || items.length === 0) return { ok: false, error: 'Your bag is empty.' };
  if (items.length > MAX_LINES) return { ok: false, error: `Too many items (max ${MAX_LINES} lines).` };

  const lines = [];
  for (const raw of items) {
    if (!raw || typeof raw !== 'object') return { ok: false, error: 'Invalid item in bag.' };
    const product = BY_ID.get(String(raw.id));
    if (!product) return { ok: false, error: 'An item in your bag is no longer available.' };

    const colorIndex = Number(raw.color);
    if (!Number.isInteger(colorIndex) || colorIndex < 0 || colorIndex >= product.colors.length) {
      return { ok: false, error: `Choose a color for ${product.name}.` };
    }
    const size = String(raw.size);
    if (!product.sizes.includes(size)) return { ok: false, error: `Choose a valid size for ${product.name}.` };

    const qty = Number(raw.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
      return { ok: false, error: `Quantity for ${product.name} must be 1–${MAX_QTY}.` };
    }
    lines.push({ product, color: product.colors[colorIndex], colorIndex, size, qty });
  }
  return { ok: true, lines };
}

function subtotalOf(lines) {
  return lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
}

function shippingOptions(subtotal) {
  const est = (r) => ({
    minimum: { unit: 'business_day', value: r.minDays },
    maximum: { unit: 'business_day', value: r.maxDays }
  });
  const standardFree = subtotal >= SHIPPING.freeThreshold;
  return [
    {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: { amount: standardFree ? 0 : SHIPPING.standard.amount, currency: CURRENCY },
        display_name: standardFree ? `${SHIPPING.standard.label} (free)` : SHIPPING.standard.label,
        delivery_estimate: est(SHIPPING.standard)
      }
    },
    {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: { amount: SHIPPING.express.amount, currency: CURRENCY },
        display_name: SHIPPING.express.label,
        delivery_estimate: est(SHIPPING.express)
      }
    }
  ];
}

/**
 * Build params for stripe.checkout.sessions.create().
 * @param {Array} lines validated lines from validateItems
 * @param {string} origin e.g. https://nrclothingsport.com (no trailing slash)
 * @param {{automaticTax?: boolean, locale?: string}} [opts]
 */
function buildSessionParams(lines, origin, opts = {}) {
  const base = String(origin).replace(/\/+$/, '');
  const subtotal = subtotalOf(lines);
  const params = {
    mode: 'payment',
    line_items: lines.map((l) => ({
      quantity: l.qty,
      price_data: {
        currency: CURRENCY,
        unit_amount: l.product.price,
        product_data: {
          name: l.product.name,
          description: `Color: ${l.color.es} (${l.color.en}) · Size: ${l.size}`,
          metadata: { product_id: l.product.id, color: l.color.es, size: l.size }
        }
      }
    })),
    shipping_address_collection: { allowed_countries: SHIPPING.countries },
    shipping_options: shippingOptions(subtotal),
    phone_number_collection: { enabled: true },
    // Compact order summary for fulfillment, visible on the payment in the Stripe Dashboard.
    metadata: {
      order: lines.map((l) => `${l.qty}x ${l.product.id} ${l.color.es} ${l.size}`).join(' | ').slice(0, 500)
    },
    success_url: `${base}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/?checkout=cancelled`
  };
  if (opts.automaticTax) params.automatic_tax = { enabled: true };
  if (opts.locale === 'es' || opts.locale === 'en') params.locale = opts.locale;
  return params;
}

module.exports = { validateItems, buildSessionParams, subtotalOf, shippingOptions, MAX_QTY };
