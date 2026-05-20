// ============================================================
// KOVA — Checkout Page Logic
// GA4 / GTM Ecommerce Events: begin_checkout, add_shipping_info,
// add_payment_info, purchase
// ============================================================

window.dataLayer = window.dataLayer || [];
function pushEvent(eventName, params) {
  window.dataLayer.push({ event: eventName, ...params });
}

// ---- State ----
const cart     = JSON.parse(localStorage.getItem('kova_cart') || '[]');
let currentStep    = 1;
let shippingMethod = 'standard';
let shippingCost   = 0;
let discountAmount  = 0;
let appliedCoupon   = null;
const TAX_RATE     = 0.08;

const FREE_SHIPPING_THRESHOLD = 75;

// ---- DOM refs ----
const steps     = document.querySelectorAll('.step');
const panels    = document.querySelectorAll('.checkout-panel');
const summaryItems    = document.getElementById('summary-items');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryShipping = document.getElementById('summary-shipping');
const summaryTax      = document.getElementById('summary-tax');
const summaryTotal    = document.getElementById('summary-total');
const discountRow     = document.getElementById('discount-row');
const summaryDiscount = document.getElementById('summary-discount');
const orderTotalBtn   = document.getElementById('order-total-btn');
const summaryTogglePrice = document.getElementById('summary-toggle-price');

// ---- Init ----
function init() {
  renderSummary();
  calculateTotals();
  updateStandardShippingLabel();

  // Show confirmation if coming back from order
  const orderDone = sessionStorage.getItem('kova_order_done');
  if (orderDone) {
    sessionStorage.removeItem('kova_order_done');
  }

  // GA4: begin_checkout
  pushEvent('begin_checkout', {
    ecommerce: {
      currency: 'USD',
      value: subtotal(),
      items: cartItems()
    }
  });
}

// ============================================================
// RENDER SUMMARY
// ============================================================
function renderSummary() {
  if (!cart.length) {
    summaryItems.innerHTML = '<li style="font-size:14px;color:#9E9892;padding:8px 0;">Your cart is empty.</li>';
    return;
  }
  summaryItems.innerHTML = cart.map(item => `
    <li class="summary-item">
      <div class="summary-item-img">
        <div class="summary-item-img-inner">
          <div style="width:56px;height:56px;background:${item.bgColor};border-radius:4px;display:flex;align-items:center;justify-content:center;">
            ${item.svgIcon}
          </div>
        </div>
        <span class="summary-item-qty">${item.qty}</span>
      </div>
      <div>
        <div class="summary-item-name">${item.name}</div>
        ${item.variant ? `<div class="summary-item-variant">${item.variant}</div>` : ''}
      </div>
      <div class="summary-item-price">$${(item.price * item.qty).toFixed(2)}</div>
    </li>
  `).join('');
}

function subtotal() {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function cartItems() {
  return cart.map(i => ({
    item_id: i.id, item_name: i.name,
    price: i.price, quantity: i.qty
  }));
}

function updateStandardShippingLabel() {
  const sub = subtotal();
  const stdEl = document.getElementById('shipping-standard-price');
  if (stdEl) stdEl.textContent = sub >= FREE_SHIPPING_THRESHOLD ? 'Free' : '$8.00';
}

function calculateTotals() {
  const sub = subtotal();
  updateStandardShippingLabel();

  // Determine shipping cost
  if (shippingMethod === 'standard') {
    shippingCost = sub >= FREE_SHIPPING_THRESHOLD ? 0 : 8;
  } else if (shippingMethod === 'express') {
    shippingCost = 12;
  } else if (shippingMethod === 'overnight') {
    shippingCost = 28;
  }

  // Apply coupon
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') discountAmount = sub * (appliedCoupon.value / 100);
    else if (appliedCoupon.type === 'fixed') discountAmount = Math.min(appliedCoupon.value, sub);
    else if (appliedCoupon.type === 'shipping') { shippingCost = 0; discountAmount = 0; }
  } else {
    discountAmount = 0;
  }

  const discountedSub = sub - discountAmount;
  const tax = discountedSub * TAX_RATE;
  const total = discountedSub + shippingCost + tax;

  // Update UI
  summarySubtotal.textContent = `$${sub.toFixed(2)}`;
  summaryShipping.textContent = shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`;
  summaryTax.textContent = `$${tax.toFixed(2)}`;
  summaryTotal.textContent = `$${total.toFixed(2)}`;

  if (discountAmount > 0) {
    discountRow.style.display = 'flex';
    summaryDiscount.textContent = `−$${discountAmount.toFixed(2)}`;
  } else {
    discountRow.style.display = 'none';
  }

  if (orderTotalBtn) orderTotalBtn.textContent = `$${total.toFixed(2)}`;
  if (summaryTogglePrice) summaryTogglePrice.textContent = `$${total.toFixed(2)}`;

  return total;
}

// ============================================================
// STEP NAVIGATION
// ============================================================
function goToStep(n) {
  if (n < 1 || n > 3) return;
  currentStep = n;

  panels.forEach((p, i) => p.classList.toggle('active', i + 1 === n));
  steps.forEach((s, i) => {
    s.classList.toggle('active', i + 1 === n);
    s.classList.toggle('done', i + 1 < n);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Step 1 → 2
document.getElementById('to-step-2')?.addEventListener('click', () => {
  if (!validateStep1()) return;
  goToStep(2);

  // GA4: add_shipping_info (we track when they get to step 2)
  // Will fire more accurately on step 3 continue
});

document.getElementById('back-to-1')?.addEventListener('click', () => goToStep(1));

// Step 2 → 3
document.getElementById('to-step-3')?.addEventListener('click', () => {
  goToStep(3);

  // GA4: add_shipping_info
  pushEvent('add_shipping_info', {
    ecommerce: {
      currency: 'USD',
      value: calculateTotals(),
      shipping_tier: shippingMethod,
      items: cartItems()
    }
  });
});

document.getElementById('back-to-2')?.addEventListener('click', () => goToStep(2));

// Shipping options
document.querySelectorAll('input[name="shipping"]').forEach(radio => {
  radio.addEventListener('change', () => {
    shippingMethod = radio.value;
    calculateTotals();
  });
});

// Payment method toggle
document.querySelectorAll('input[name="payment"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const isCard = radio.value === 'card';
    document.getElementById('card-fields').classList.toggle('hidden', !isCard);
    document.getElementById('paypal-note').classList.toggle('hidden', isCard);
    document.getElementById('pm-card').classList.toggle('active', isCard);
    document.getElementById('pm-paypal').classList.toggle('active', !isCard);
  });
});

// Place Order
document.getElementById('place-order')?.addEventListener('click', () => {
  if (!validatePayment()) return;

  const total = calculateTotals();
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'card';
  const email = document.getElementById('email')?.value || '';

  // GA4: add_payment_info
  pushEvent('add_payment_info', {
    ecommerce: {
      currency: 'USD',
      value: total,
      payment_type: paymentMethod,
      items: cartItems()
    }
  });

  // GA4: purchase
  const orderNum = 'KV-' + Math.floor(Math.random() * 90000 + 10000);
  pushEvent('purchase', {
    ecommerce: {
      transaction_id: orderNum,
      value: total,
      tax: (subtotal() - discountAmount) * TAX_RATE,
      shipping: shippingCost,
      currency: 'USD',
      coupon: appliedCoupon ? document.getElementById('coupon-input').value.trim().toUpperCase() : undefined,
      items: cartItems()
    }
  });

  // Clear cart
  localStorage.removeItem('kova_cart');

  // Show confirmation
  document.getElementById('confirm-email').textContent = email;
  document.getElementById('confirm-order-num').textContent = orderNum;
  document.getElementById('confirm-modal').style.display = 'flex';
});

// ============================================================
// COUPON
// ============================================================
document.getElementById('apply-coupon')?.addEventListener('click', () => {
  const code  = document.getElementById('coupon-input').value.trim().toUpperCase();
  const msgEl = document.getElementById('coupon-msg');
  msgEl.classList.remove('hidden', 'success', 'error');

  if (!code) { msgEl.textContent = 'Please enter a code.'; msgEl.classList.add('error'); return; }

  const coupon = COUPONS[code];
  if (coupon) {
    appliedCoupon = coupon;
    msgEl.textContent = '✓ ' + coupon.label;
    msgEl.classList.add('success');
    calculateTotals();
    pushEvent('select_promotion', { creative_name: code, promotion_name: coupon.label });
  } else {
    appliedCoupon = null;
    msgEl.textContent = 'Code not recognised.';
    msgEl.classList.add('error');
    calculateTotals();
  }
});

// ============================================================
// VALIDATION
// ============================================================
function validateStep1() {
  const fields = ['email','first-name','last-name','address','city','zip'];
  let valid = true;
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.value.trim()) {
      el.classList.add('error');
      valid = false;
    } else {
      el?.classList.remove('error');
    }
  });
  const state = document.getElementById('state');
  if (state && !state.value) { state.classList.add('error'); valid = false; }
  else state?.classList.remove('error');

  if (!valid) {
    const firstErr = document.querySelector('.form-group input.error, .form-group select.error');
    firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  return valid;
}

function validatePayment() {
  const method = document.querySelector('input[name="payment"]:checked')?.value;
  if (method !== 'card') return true;

  const num = document.getElementById('card-number')?.value.replace(/\s/g,'');
  const name = document.getElementById('card-name')?.value;
  const exp = document.getElementById('card-expiry')?.value;
  const cvv = document.getElementById('card-cvv')?.value;

  if (!num || num.length < 15 || !name || !exp || !cvv) {
    alert('Please fill in all card details.');
    return false;
  }
  return true;
}

// ============================================================
// CARD NUMBER FORMATTING
// ============================================================
document.getElementById('card-number')?.addEventListener('input', function() {
  let v = this.value.replace(/\D/g,'').slice(0,16);
  this.value = v.replace(/(.{4})/g,'$1 ').trim();
});
document.getElementById('card-expiry')?.addEventListener('input', function() {
  let v = this.value.replace(/\D/g,'').slice(0,4);
  if (v.length >= 3) v = v.slice(0,2) + ' / ' + v.slice(2);
  this.value = v;
});

// ============================================================
// MOBILE SUMMARY TOGGLE
// ============================================================
document.getElementById('summary-toggle')?.addEventListener('click', () => {
  const body = document.getElementById('summary-body');
  const toggleEl = document.getElementById('summary-toggle');
  body.classList.toggle('open');
  const spans = toggleEl.querySelectorAll('span');
  if (spans[0]) spans[0].textContent = body.classList.contains('open') ? 'Hide order summary ▲' : 'Show order summary ▼';
});

// ---- Boot ----
init();
