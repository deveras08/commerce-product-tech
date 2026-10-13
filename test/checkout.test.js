// Run: npm test   (no Stripe keys or network needed)
const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const { CATALOG, SHIPPING } = require('../catalog.js');
const { validateItems, buildSessionParams } = require('../lib/checkout.js');

const sculpt = CATALOG.find((p) => p.id === 'sculpt-set');

test('catalog: every product has sane price, colors, sizes, image', () => {
  const ids = new Set();
  for (const p of CATALOG) {
    assert.ok(!ids.has(p.id), `duplicate id ${p.id}`); ids.add(p.id);
    assert.ok(Number.isInteger(p.price) && p.price >= 50, `${p.id} price must be integer cents`);
    assert.ok(p.colors.length >= 1 && p.colors.every((c) => c.en && c.es && /^#[0-9a-f]{6}$/i.test(c.hex)), `${p.id} colors`);
    assert.ok(p.sizes.length >= 1, `${p.id} sizes`);
    assert.ok(p.desc.en && p.desc.es && p.details.en.length && p.details.es.length, `${p.id} copy`);
    assert.ok(require('node:fs').existsSync(path.join(__dirname, '..', p.image)), `${p.id} image missing`);
  }
});

test('validate: accepts a good cart and ignores any client price', () => {
  const v = validateItems([{ id: 'sculpt-set', color: 9, size: 'M', qty: 2, price: 1 }]);
  assert.ok(v.ok);
  const params = buildSessionParams(v.lines, 'https://shop.example');
  assert.strictEqual(params.line_items[0].price_data.unit_amount, sculpt.price);
  assert.strictEqual(params.line_items[0].quantity, 2);
  assert.match(params.line_items[0].price_data.product_data.description, /Rosado claro.*Size: M/);
});

test('validate: rejects bad input', () => {
  const bad = [
    [], null, 'x', [{ id: 'nope', color: 0, size: 'M', qty: 1 }],
    [{ id: 'sculpt-set', color: 99, size: 'M', qty: 1 }],
    [{ id: 'sculpt-set', color: 0, size: 'XXL', qty: 1 }],
    [{ id: 'sculpt-set', color: 0, size: 'M', qty: 0 }],
    [{ id: 'sculpt-set', color: 0, size: 'M', qty: 11 }],
    [{ id: 'sculpt-set', color: '0', size: 'M', qty: 1.5 }],
    Array.from({ length: 21 }, () => ({ id: 'sculpt-set', color: 0, size: 'M', qty: 1 }))
  ];
  for (const items of bad) assert.strictEqual(validateItems(items).ok, false, JSON.stringify(items).slice(0, 80));
});

test('shipping: standard is free at the threshold, paid below it', () => {
  const below = validateItems([{ id: 'breeze-set', color: 0, size: 'S', qty: 1 }]).lines;
  const above = validateItems([{ id: 'breeze-set', color: 0, size: 'S', qty: 2 }]).lines;
  const pBelow = buildSessionParams(below, 'https://x.test');
  const pAbove = buildSessionParams(above, 'https://x.test');
  assert.strictEqual(pBelow.shipping_options[0].shipping_rate_data.fixed_amount.amount, SHIPPING.standard.amount);
  assert.strictEqual(pAbove.shipping_options[0].shipping_rate_data.fixed_amount.amount, 0);
  assert.strictEqual(pAbove.shipping_options[1].shipping_rate_data.fixed_amount.amount, SHIPPING.express.amount);
});

test('session params: redirect URLs, mode, metadata limits', () => {
  const lines = validateItems([{ id: 'cherry-one-piece', color: 0, size: 'L', qty: 1 }]).lines;
  const p = buildSessionParams(lines, 'https://shop.example/', { automaticTax: true, locale: 'es' });
  assert.strictEqual(p.mode, 'payment');
  assert.strictEqual(p.success_url, 'https://shop.example/?checkout=success&session_id={CHECKOUT_SESSION_ID}');
  assert.strictEqual(p.cancel_url, 'https://shop.example/?checkout=cancelled');
  assert.deepStrictEqual(p.automatic_tax, { enabled: true });
  assert.strictEqual(p.locale, 'es');
  assert.deepStrictEqual(p.shipping_address_collection.allowed_countries, ['US']);
  assert.ok(p.metadata.order.length <= 500);
});

test('API handler: uses Stripe and returns the session URL (Stripe stubbed)', async () => {
  let captured = null;
  const stripePath = require.resolve('stripe', { paths: [path.join(__dirname, '..')] });
  require.cache[stripePath] = {
    id: stripePath, filename: stripePath, loaded: true,
    exports: function FakeStripe() {
      return { checkout: { sessions: { create: async (params) => { captured = params; return { url: 'https://checkout.stripe.com/c/pay/cs_test_123' }; } } } };
    }
  };
  process.env.STRIPE_SECRET_KEY = 'sk_test_fake';
  process.env.SITE_URL = 'https://shop.example';
  const handler = require('../api/create-checkout-session.js');

  const call = (req) => new Promise((resolve) => {
    const res = { headers: {}, statusCode: 200,
      setHeader(k, v) { this.headers[k] = v; },
      status(c) { this.statusCode = c; return this; },
      json(b) { resolve({ status: this.statusCode, body: b }); } };
    handler(req, res);
  });

  const ok = await call({ method: 'POST', headers: { host: 'x' }, body: { items: [{ id: 'sculpt-set', color: 0, size: 'S', qty: 1 }], locale: 'en' } });
  assert.strictEqual(ok.status, 200);
  assert.strictEqual(ok.body.url, 'https://checkout.stripe.com/c/pay/cs_test_123');
  assert.strictEqual(captured.line_items[0].price_data.unit_amount, sculpt.price);
  assert.match(captured.success_url, /^https:\/\/shop\.example\//);

  const str = await call({ method: 'POST', headers: {}, body: JSON.stringify({ items: [{ id: 'sculpt-set', color: 0, size: 'S', qty: 1 }] }) });
  assert.strictEqual(str.status, 200);

  const bad = await call({ method: 'POST', headers: {}, body: { items: [{ id: 'sculpt-set', color: 0, size: 'XL', qty: 1 }] } });
  assert.strictEqual(bad.status, 400);

  const get = await call({ method: 'GET', headers: {} });
  assert.strictEqual(get.status, 405);
});
