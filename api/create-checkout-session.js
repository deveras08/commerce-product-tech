// Vercel serverless function: POST /api/create-checkout-session
// Body: { items: [{ id, color, size, qty }], locale?: 'en' | 'es' }
// Returns: { url } — the browser redirects there (Stripe-hosted Checkout).
//
// Env vars (set in Vercel → Project → Settings → Environment Variables):
//   STRIPE_SECRET_KEY     sk_test_... while testing, sk_live_... at launch (merchant's own account)
//   SITE_URL              https://your-domain.com (used for success/cancel redirects)
//   STRIPE_AUTOMATIC_TAX  "true" only after Stripe Tax is set up and registrations exist
const Stripe = require('stripe');
const { validateItems, buildSessionParams } = require('../lib/checkout.js');

let stripe = null;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(503).json({ error: 'Payments are not configured yet.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid request.' }); }
  }

  const check = validateItems(body && body.items);
  if (!check.ok) return res.status(400).json({ error: check.error });

  const origin = process.env.SITE_URL || `https://${req.headers['x-forwarded-host'] || req.headers.host}`;

  try {
    stripe = stripe || new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create(
      buildSessionParams(check.lines, origin, {
        automaticTax: process.env.STRIPE_AUTOMATIC_TAX === 'true',
        locale: body && body.locale
      })
    );
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe Checkout Session failed:', err && err.message);
    return res.status(502).json({ error: 'Checkout could not start. Try again in a moment.' });
  }
};
