# KOVA — Ecommerce Website

A fully functional static ecommerce site built for GitHub Pages.

## File Structure

```
/
├── index.html          # Homepage: hero, products, cart drawer
├── checkout.html       # Multi-step checkout: info → shipping → payment
├── css/
│   └── style.css       # All styles
└── js/
    ├── products.js     # Product catalog + coupon codes
    ├── app.js          # Homepage: cart, modal, search, filter, GA4 events
    └── checkout.js     # Checkout: multi-step, coupon, purchase event
```

## GitHub Pages Deployment

1. Create a new GitHub repo (e.g. `kova-store`)
2. Push all files with the folder structure above
3. Go to **Settings → Pages → Source → main branch / root**
4. Your site will be live at `https://yourusername.github.io/kova-store/`

## GTM Setup

1. Create a GTM container at tagmanager.google.com
2. In `index.html` and `checkout.html`, uncomment the GTM snippets and replace `GTM-XXXXXXX` with your container ID
3. In GTM, set up a GA4 Configuration Tag with your `G-XXXXXXXXXX` measurement ID
4. Use the `dataLayer` events below to create triggers

## GA4 Events Fired

| Event | Fired When |
|---|---|
| `view_item_list` | Page load and filter changes |
| `select_item` | Product card "View" clicked |
| `view_item` | Product modal opened |
| `add_to_cart` | Item added to cart |
| `remove_from_cart` | Item removed from cart |
| `view_cart` | Cart drawer opened |
| `begin_checkout` | Checkout page loaded / "Proceed to Checkout" clicked |
| `add_shipping_info` | Shipping step continued |
| `add_payment_info` | Payment method confirmed |
| `purchase` | Order placed |
| `search` | Search query entered |
| `generate_lead` | Newsletter signup |
| `select_promotion` | Coupon code applied |

## Coupon Codes (for testing)

| Code | Effect |
|---|---|
| `WELCOME10` | 10% off |
| `KOVA20` | 20% off |
| `SAVE15` | $15 off |
| `SHIP` | Free shipping |

## Customisation

- **Products**: Edit `js/products.js` — each product has id, name, category, price, colors, description, meta facts, and SVG icon
- **Colors**: Edit CSS variables in `:root` in `css/style.css`
- **Brand name**: Find/replace "KOVA" across all files
- **Tax rate**: Change `TAX_RATE` in `js/checkout.js`
- **Free shipping threshold**: Change `FREE_SHIPPING_THRESHOLD` in `js/checkout.js` and `app.js`
