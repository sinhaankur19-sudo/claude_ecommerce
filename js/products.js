// ============================================================
// KOVA — Product Catalog
// ============================================================

const PRODUCTS = [
  {
    id: 'p001',
    name: 'Ceramic Pour-Over Carafe',
    category: 'kitchen',
    price: 68,
    originalPrice: null,
    badge: 'New',
    description: 'Hand-thrown from high-fire stoneware. A generous 800ml capacity with a wide mouth for easy cleaning. The matte glaze develops a subtle patina over time.',
    colors: ['Chalk', 'Slate', 'Sand'],
    meta: ['Ships in 3–5 business days', 'Dishwasher safe', 'Food-grade glaze'],
    bgColor: '#E8DFD2',
    svgIcon: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none"><ellipse cx="40" cy="60" rx="22" ry="8" fill="#C4B49A" opacity=".4"/><path d="M22 28h36v26a8 8 0 01-8 8H30a8 8 0 01-8-8V28z" fill="#C4B49A"/><path d="M18 28h44v6H18z" rx="2" fill="#B0A08A"/><path d="M40 12v16" stroke="#C4B49A" stroke-width="3" stroke-linecap="round"/><path d="M54 20c3 2 3 6 0 8" stroke="#C4B49A" stroke-width="2" stroke-linecap="round"/></svg>`,
    thumbColors: ['#E8DFD2', '#C8CDD4', '#D4C8B0']
  },
  {
    id: 'p002',
    name: 'Linen Hardcover Notebook',
    category: 'personal',
    price: 34,
    originalPrice: null,
    badge: null,
    description: 'A5 format, 200 pages of 100gsm acid-free cream paper. Lay-flat binding, natural linen cover, and a grosgrain bookmark ribbon. For people who still write things down.',
    colors: ['Natural', 'Forest', 'Midnight'],
    meta: ['Lay-flat binding', '100gsm cream paper', 'Ribbon bookmark'],
    bgColor: '#D5E0D8',
    svgIcon: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none"><rect x="18" y="14" width="44" height="52" rx="3" fill="#8BAD90"/><rect x="14" y="14" width="8" height="52" rx="2" fill="#6D9272"/><rect x="26" y="28" width="28" height="2" rx="1" fill="#fff" opacity=".7"/><rect x="26" y="36" width="22" height="2" rx="1" fill="#fff" opacity=".5"/><rect x="26" y="44" width="18" height="2" rx="1" fill="#fff" opacity=".4"/></svg>`,
    thumbColors: ['#D5E0D8', '#C4CFBA', '#2A3B4C']
  },
  {
    id: 'p003',
    name: 'Walnut Wood Tray',
    category: 'living',
    price: 54,
    originalPrice: 72,
    badge: 'Sale',
    description: 'Solid American black walnut with a pure tung oil finish. Use it as a desk organizer, bedside catch-all, or coffee table centrepiece. Each tray has a unique grain pattern.',
    colors: ['Natural Walnut'],
    meta: ['Solid hardwood', 'Tung oil finish', 'Hand-sanded edges'],
    bgColor: '#EAE0D0',
    svgIcon: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none"><rect x="14" y="32" width="52" height="28" rx="3" fill="#8B6443"/><rect x="18" y="36" width="44" height="20" rx="2" fill="#A0764E"/><path d="M14 32h52v6H14z" fill="#7A5535" rx="1"/><path d="M20 42c8-2 16-2 24 0s16 2 16 0" stroke="#6B4A2E" stroke-width="1.5" stroke-linecap="round" opacity=".5"/></svg>`,
    thumbColors: ['#EAE0D0']
  },
  {
    id: 'p004',
    name: 'Merino Wool Throw',
    category: 'living',
    price: 125,
    originalPrice: null,
    badge: null,
    description: 'Woven from extra-fine 18.5-micron merino wool. Naturally temperature-regulating, breathable, and gets softer with every wash. 130×170cm, weighs just 600g.',
    colors: ['Oat', 'Graphite', 'Rust', 'Sage'],
    meta: ['100% merino wool', 'Hand-wash recommended', 'OEKO-TEX certified'],
    bgColor: '#F0EAE0',
    svgIcon: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none"><path d="M15 25c8 4 15 10 25 10s17-6 25-10v30c-8 4-15 10-25 10S23 59 15 55V25z" fill="#D4C8B4"/><path d="M15 25c8 4 15 10 25 10s17-6 25-10" stroke="#BFB09A" stroke-width="2"/><path d="M20 38c6 3 10 7 20 7s14-4 20-7" stroke="#BFB09A" stroke-width="1.5" opacity=".6"/><path d="M18 50c6 2 12 6 22 6s16-4 22-6" stroke="#BFB09A" stroke-width="1.5" opacity=".4"/></svg>`,
    thumbColors: ['#F0EAE0', '#4A4A4A', '#8B3A2A', '#5C7A5E']
  },
  {
    id: 'p005',
    name: 'Beeswax Candle Set',
    category: 'living',
    price: 42,
    originalPrice: null,
    badge: null,
    description: 'A set of three hand-poured pure beeswax pillars. Burns clean and slow — up to 40 hours each. Subtle honey scent, naturally golden hue. No additives, no synthetic fragrance.',
    colors: null,
    meta: ['Burns 40+ hours each', 'Pure beeswax, no additives', 'Set of three'],
    bgColor: '#FAF0D8',
    svgIcon: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none"><rect x="28" y="34" width="12" height="28" rx="2" fill="#E8CC7A"/><rect x="44" y="38" width="12" height="24" rx="2" fill="#D4B85A"/><rect x="15" y="42" width="10" height="20" rx="2" fill="#F0D888"/><path d="M34 34c0-4 4-8 4-8s4 4 4 8" stroke="#C8A030" stroke-width="1.5" stroke-linecap="round"/><circle cx="38" cy="26" r="3" fill="#FF9020" opacity=".8"/></svg>`,
    thumbColors: ['#FAF0D8']
  },
  {
    id: 'p006',
    name: 'Bamboo Bath Set',
    category: 'personal',
    price: 38,
    originalPrice: 52,
    badge: 'Sale',
    description: 'A curated set of bamboo bathroom essentials: toothbrush holder, soap dish, and tumbler. Sustainably harvested and sealed with a water-resistant natural oil.',
    colors: ['Natural Bamboo'],
    meta: ['FSC-certified bamboo', 'Water-resistant finish', 'Set of three pieces'],
    bgColor: '#E0EAE0',
    svgIcon: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none"><rect x="22" y="36" width="14" height="22" rx="3" fill="#8BAD8B"/><rect x="40" y="44" width="18" height="14" rx="2" fill="#7A9A7A"/><rect x="22" y="26" width="14" height="4" rx="1" fill="#6D8A6D"/><line x1="26" y1="38" x2="26" y2="56" stroke="#5A7A5A" stroke-width="1" stroke-dasharray="2 3"/><line x1="30" y1="38" x2="30" y2="56" stroke="#5A7A5A" stroke-width="1" stroke-dasharray="2 3"/></svg>`,
    thumbColors: ['#E0EAE0']
  },
  {
    id: 'p007',
    name: 'Cast Iron Trivet',
    category: 'kitchen',
    price: 29,
    originalPrice: null,
    badge: null,
    description: 'A raw cast iron trivet in a simple geometric form. Naturally heat-resistant, it doubles as a table centrepiece between meals. Gets better looking with age and use.',
    colors: null,
    meta: ['Raw cast iron', 'Heat-resistant to 500°C', 'Improves with age'],
    bgColor: '#E0DDD8',
    svgIcon: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none"><polygon points="40,16 62,54 18,54" fill="#5A5550"/><polygon points="40,24 57,52 23,52" fill="#6A6560" opacity=".7"/><circle cx="40" cy="40" r="6" fill="#4A4540"/><circle cx="40" cy="40" r="3" fill="#3A3530"/></svg>`,
    thumbColors: ['#E0DDD8']
  },
  {
    id: 'p008',
    name: 'Linen Apron',
    category: 'kitchen',
    price: 58,
    originalPrice: null,
    badge: 'New',
    description: 'Pre-washed Belgian linen in a generous cross-back silhouette. Two front pockets, adjustable tie. Naturally antimicrobial and gets softer with every wash.',
    colors: ['Natural', 'Charcoal', 'Clay'],
    meta: ['100% Belgian linen', 'Cross-back design', 'Machine washable'],
    bgColor: '#EAE4D8',
    svgIcon: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none"><path d="M28 18h24l6 14H22L28 18z" fill="#C4B49A"/><rect x="22" y="32" width="36" height="32" rx="2" fill="#D4C4AA"/><rect x="26" y="38" width="12" height="16" rx="1" fill="#C4B49A"/><rect x="42" y="38" width="12" height="16" rx="1" fill="#C4B49A"/></svg>`,
    thumbColors: ['#EAE4D8', '#4A4540', '#C4785A']
  }
];

// ============================================================
// Coupon Codes
// ============================================================
const COUPONS = {
  'WELCOME10': { type: 'percent', value: 10, label: '10% off applied' },
  'KOVA20':    { type: 'percent', value: 20, label: '20% off applied' },
  'SHIP':      { type: 'shipping', value: 0, label: 'Free shipping applied' },
  'SAVE15':    { type: 'fixed', value: 15, label: '$15 off applied' }
};
