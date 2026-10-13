/*
 * NR Clothing Sport — product catalog (single source of truth)
 *
 * Loaded by the storefront (index.html) AND required by the Stripe checkout
 * function (api/create-checkout-session.js). The server charges the price in
 * THIS file, never a price sent from the browser.
 *
 * Source: products, colors and sizes as posted on instagram.com/nrdsportt
 * (captured Oct 13, 2026). Items marked `verify` need confirmation from NR.
 *
 * !! PLACEHOLDERS — confirm with NR before launch !!
 *  - Every PRICE (Instagram lists none; they sell by DM)
 *  - Swim sizes (not posted) and stock for older sets (posted Mar–Apr 2026)
 *  - Shipping rates and free-shipping threshold
 *  - "Made in Colombia" (stated by NR for the bikini collection)
 * Do not add fabric/performance claims (UPF, compression, squat-proof, etc.)
 * unless the manufacturer's spec sheet supports them.
 */
(function (root, factory) {
  var data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  else root.NR = data;
})(typeof self !== 'undefined' ? self : this, function () {
  var CURRENCY = 'usd';

  var SHIPPING = {
    freeThreshold: 10000, // cents — free standard US shipping at $100+ (placeholder)
    standard: { label: 'Standard shipping', amount: 795, minDays: 3, maxDays: 7 },
    express: { label: 'Express shipping', amount: 1895, minDays: 1, maxDays: 3 },
    countries: ['US'] // DR orders stay on WhatsApp in v1 (see README)
  };

  // Color names as NR uses them (Spanish), with English labels.
  var C = {
    blanco: { en: 'White', es: 'Blanco', hex: '#f4f4f1' },
    lila: { en: 'Lilac', es: 'Lila', hex: '#c7b5dc' },
    beige: { en: 'Beige', es: 'Beige', hex: '#d8c4a6' },
    rojoVino: { en: 'Wine', es: 'Rojo vino', hex: '#6d1e2c' },
    purpura: { en: 'Purple', es: 'Púrpura', hex: '#6a3d8f' },
    verdeOliva: { en: 'Olive', es: 'Verde oliva', hex: '#6a6e40' },
    rosado: { en: 'Pink', es: 'Rosado', hex: '#e49ab0' },
    azulMarino: { en: 'Navy', es: 'Azul marino', hex: '#1e2a4c' },
    azul: { en: 'Blue', es: 'Azul', hex: '#3d6db0' },
    rosadoClaro: { en: 'Light pink', es: 'Rosado claro', hex: '#f2cad4' },
    negro: { en: 'Black', es: 'Negro', hex: '#141414' },
    gris: { en: 'Gray', es: 'Gris', hex: '#8b8e91' },
    verdeGuardia: { en: 'Hunter green', es: 'Verde guardia', hex: '#3f5a44' },
    rojo: { en: 'Red', es: 'Rojo', hex: '#c2262e' },
    verdeSalvia: { en: 'Sage', es: 'Verde salvia', hex: '#9db096' },
    violeta: { en: 'Violet', es: 'Violeta', hex: '#7b58a8' },
    marron: { en: 'Brown', es: 'Marrón', hex: '#6a4732' },
    azulCielo: { en: 'Sky blue', es: 'Azul cielo', hex: '#9ccae9' },
    amarillo: { en: 'Yellow', es: 'Amarillo', hex: '#f1cf47' },
    naranja: { en: 'Orange', es: 'Naranja', hex: '#ef883a' },
    grisOscuro: { en: 'Charcoal', es: 'Gris oscuro', hex: '#4a4a4f' },
    topo: { en: 'Taupe', es: 'Topo', hex: '#b8a898' }
  };
  function print(en, es, hex) { return { en: en, es: es, hex: hex, print: true }; }

  var SML = ['S', 'M', 'L'];

  var CATALOG = [
    // ── Activewear: newest drops ───────────────────────────────────────────
    {
      id: 'sculpt-set', cat: 'train', type: 'sets', name: 'Sculpt Set',
      price: 6800, image: 'images/sculpt-set.jpg', badge: 'new',
      colors: [C.blanco, C.lila, C.beige, C.rojoVino, C.purpura, C.verdeOliva, C.rosado, C.azulMarino,
               C.azul, C.rosadoClaro, C.negro, C.gris, C.verdeGuardia, C.rojo, C.verdeSalvia],
      sizes: SML,
      desc: { en: 'Half-zip long-sleeve top with a matching high-waist legging. Minimal lines, wear it together or split it up.',
              es: 'Top manga larga con media cremallera y legging de tiro alto a juego. Líneas limpias; úsalo junto o por separado.' },
      details: { en: ['Two pieces: half-zip top + legging', '15 colors', 'Sizes S, M, L'],
                 es: ['Dos piezas: top con media cremallera + legging', '15 colores', 'Tallas S, M, L'] }
    },
    {
      id: 'breeze-set', cat: 'train', type: 'sets', name: 'Breeze Set',
      price: 5800, image: 'images/breeze-set.jpg', badge: 'new',
      colors: [C.violeta, C.negro, C.verdeOliva, C.verdeGuardia, C.marron, C.azulMarino, C.rosado,
               C.azulCielo, C.beige, C.amarillo, C.rojo, C.naranja],
      sizes: SML,
      desc: { en: 'Fitted short-sleeve tee with a matching bike short, for warm days and hard sessions.',
              es: 'Camiseta ajustada manga corta con short ciclista a juego, para días de calor y entrenos fuertes.' },
      details: { en: ['Two pieces: tee + bike short', '12 colors', 'Sizes S, M, L'],
                 es: ['Dos piezas: camiseta + short ciclista', '12 colores', 'Tallas S, M, L'] }
    },
    {
      id: 'selena-set', cat: 'train', type: 'sets', name: 'Selena Set',
      price: 6400, image: 'images/selena-set.jpg', badge: 'new', verify: 'colors read from post emojis',
      colors: [C.marron, C.negro, C.purpura, C.blanco],
      sizes: SML,
      desc: { en: 'Zip-front long-sleeve set that goes from training to plans after.',
              es: 'Conjunto manga larga con cremallera al frente, del entreno a tus planes del día.' },
      details: { en: ['Zip front, long sleeve', '4 colors', 'Sizes S, M, L'],
                 es: ['Cremallera al frente, manga larga', '4 colores', 'Tallas S, M, L'] }
    },
    // ── Activewear: earlier collection (confirm stock) ─────────────────────
    {
      id: 'effortless-set', cat: 'train', type: 'sets', name: 'Effortless Set',
      price: 6200, image: 'images/effortless-set.jpg', verify: 'stock + colors',
      colors: [C.blanco], sizes: SML,
      desc: { en: 'V-neck racerback top with a matching legging.',
              es: 'Top cuello en V con espalda deportiva y legging a juego.' },
      details: { en: ['V-neck racerback top + legging', 'Shown in white'],
                 es: ['Top cuello en V + legging', 'En la foto: blanco'] }
    },
    {
      id: 'pilates-princess-set', cat: 'train', type: 'sets', name: 'Pilates Princess Set',
      price: 6400, image: 'images/pilates-princess-set.jpg', verify: 'stock + colors',
      colors: [C.grisOscuro, C.rosadoClaro], sizes: SML,
      desc: { en: 'Long-sleeve scoop-neck top with a black legging. Made for reformer days.',
              es: 'Top manga larga cuello redondo con legging negro. Para tus días de reformer.' },
      details: { en: ['Long-sleeve top + black legging', 'Shown in charcoal and light pink'],
                 es: ['Top manga larga + legging negro', 'En la foto: gris oscuro y rosado claro'] }
    },
    {
      id: 'mindful-set', cat: 'train', type: 'sets', name: 'Mindful Set',
      price: 5800, image: 'images/mindful-set.jpg', verify: 'stock + colors',
      colors: [C.negro, C.blanco], sizes: SML,
      desc: { en: 'Sleeveless contrast-trim top with a pleated skirt. Court-ready.',
              es: 'Top sin mangas con ribete en contraste y falda plisada. Lista para la cancha.' },
      details: { en: ['Sleeveless top + pleated skirt', 'Shown in black and white'],
                 es: ['Top sin mangas + falda plisada', 'En la foto: negro y blanco'] }
    },
    {
      id: 'breath-set', cat: 'train', type: 'sets', name: 'Breath Set',
      price: 6000, image: 'images/breath-set.jpg', verify: 'stock + colors',
      colors: [C.negro, C.topo], sizes: SML,
      desc: { en: 'Open-back one-piece with crossed straps and full-length legs.',
              es: 'Enterizo de espalda abierta con tiras cruzadas y pierna completa.' },
      details: { en: ['Open back, crossed straps', 'Shown in black and taupe'],
                 es: ['Espalda abierta, tiras cruzadas', 'En la foto: negro y topo'] }
    },
    {
      id: 'reform-set', cat: 'train', type: 'sets', name: 'Reform Set',
      price: 6200, image: 'images/reform-set.jpg', verify: 'stock + colors',
      colors: [C.azulMarino, C.rojoVino], sizes: SML,
      desc: { en: 'Short-sleeve half-zip top with a black legging.',
              es: 'Top manga corta con media cremallera y legging negro.' },
      details: { en: ['Half-zip top + black legging', 'Shown in navy and wine'],
                 es: ['Top con media cremallera + legging negro', 'En la foto: azul marino y rojo vino'] }
    },
    // ── Swim (NR: made in Colombia) ─────────────────────────────────────────
    {
      id: 'bunny-bikini', cat: 'swim', type: 'bikinis', name: 'Bunny Bikini',
      price: 4800, image: 'images/bunny-bikini.jpg', verify: 'renamed from a celebrity trademark; sizes',
      colors: [print('Multicolor print', 'Estampado multicolor', '#b9a6e3')], sizes: SML,
      desc: { en: 'Scoop bralette top and high-cut bottom in a bold multicolor print.',
              es: 'Top tipo bralette y panty de corte alto con un estampado multicolor atrevido.' },
      details: { en: ['Bralette top + high-cut bottom', 'Made in Colombia (per NR)'],
                 es: ['Top bralette + panty corte alto', 'Hecho en Colombia (según NR)'] }
    },
    {
      id: 'positano-bikini', cat: 'swim', type: 'bikinis', name: 'Positano Bikini',
      price: 4800, image: 'images/positano-bikini.jpg', verify: 'sizes',
      colors: [print('Pink print', 'Estampado rosado', '#e9a7c0')], sizes: SML,
      desc: { en: 'Soft-pink printed bandeau top with a cheeky bottom.',
              es: 'Top bandeau estampado en rosado suave con panty brasileño.' },
      details: { en: ['Bandeau top + cheeky bottom', 'Made in Colombia (per NR)'],
                 es: ['Top bandeau + panty brasileño', 'Hecho en Colombia (según NR)'] }
    },
    {
      id: 'cowgirl-bikini', cat: 'swim', type: 'bikinis', name: 'Cow Girl Bikini',
      price: 4800, image: 'images/cowgirl-bikini.jpg', verify: 'sizes',
      colors: [print('Western print', 'Estampado western', '#f3d6de')], sizes: SML,
      desc: { en: 'Western-print triangle top with pearl-bead straps and a tie-side bottom.',
              es: 'Top de triángulo estampado western con tiras de perlas y panty de amarre lateral.' },
      details: { en: ['Triangle top with pearl detail', 'Tie-side bottom', 'Made in Colombia (per NR)'],
                 es: ['Top triángulo con perlas', 'Panty de amarre lateral', 'Hecho en Colombia (según NR)'] }
    },
    {
      id: 'lemon-bikini', cat: 'swim', type: 'bikinis', name: 'Lemon Bikini',
      price: 4800, image: 'images/lemon-bikini.jpg', verify: 'sizes',
      colors: [print('Lemon print', 'Estampado limón', '#f2d35a')], sizes: SML,
      desc: { en: 'Lemon-print bandeau with a halter tie and a low-rise bottom.',
              es: 'Bandeau estampado de limones con amarre al cuello y panty de tiro bajo.' },
      details: { en: ['Halter bandeau + low-rise bottom', 'Made in Colombia (per NR)'],
                 es: ['Bandeau con amarre al cuello + panty tiro bajo', 'Hecho en Colombia (según NR)'] }
    },
    {
      id: 'cherry-one-piece', cat: 'swim', type: 'one-pieces', name: 'Cherry One-Piece',
      price: 5400, image: 'images/cherry-one-piece.jpg', verify: 'sizes',
      colors: [print('Cherry print', 'Estampado cerezas', '#d8323f')], sizes: SML,
      desc: { en: 'Square-neck one-piece with thin straps in a cherry print.',
              es: 'Enterizo de escote cuadrado y tiras finas con estampado de cerezas.' },
      details: { en: ['Square neck, thin straps', 'Made in Colombia (per NR)'],
                 es: ['Escote cuadrado, tiras finas', 'Hecho en Colombia (según NR)'] }
    },
    {
      id: 'shell-one-piece', cat: 'swim', type: 'one-pieces', name: 'Shell One-Piece',
      price: 5400, image: 'images/shell-one-piece.jpg', verify: 'sizes',
      colors: [print('Shell print', 'Estampado conchas', '#e8d2c2')], sizes: SML,
      desc: { en: 'Seashell-print one-piece with a front cutout.',
              es: 'Enterizo con estampado de conchas y abertura al frente.' },
      details: { en: ['Front cutout', 'Made in Colombia (per NR)'],
                 es: ['Abertura al frente', 'Hecho en Colombia (según NR)'] }
    }
  ];

  // Approved customer reviews. Starts EMPTY on purpose: only publish real reviews from real
  // customers (FTC rule on fake reviews, 16 CFR Part 465). Shape of one entry:
  // { productId: 'sculpt-set', rating: 5, title: '…', body: '…', name: 'Ana R.', date: '2026-11-02',
  //   size: 'M', usualSize: 'M', fit: 0 /* -1 runs small, 0 true to size, 1 runs large */,
  //   verified: true /* matched to an order */, photos: ['images/reviews/ana-1.jpg'] }
  var REVIEWS = [];

  return { CURRENCY: CURRENCY, SHIPPING: SHIPPING, CATALOG: CATALOG, REVIEWS: REVIEWS };
});
