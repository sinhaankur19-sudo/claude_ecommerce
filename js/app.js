// ============================================================
// KOVA — Main App
// GA4 / GTM Ecommerce Events wired throughout
// ============================================================

// ---- dataLayer helper ----
window.dataLayer = window.dataLayer || [];
function pushEvent(eventName, params) {
  window.dataLayer.push({ event: eventName, ...params });
  // console.log('[GTM]', eventName, params); // Uncomment to debug
}

// ---- State ----
let cart = JSON.parse(localStorage.getItem('kova_cart') || '[]');
let activeFilter = 'all';
let activeSort = 'default';
let searchQuery = '';
let currentProduct = null;
let currentQty = 1;

// ---- DOM refs ----
const cartBtn       = document.getElementById('cart-btn');
const cartDrawer    = document.getElementById('cart-drawer');
const cartOverlay   = document.getElementById('cart-overlay');
const cartClose     = document.getElementById('cart-close');
const cartItemsEl   = document.getElementById('cart-items');
const cartEmptyEl   = document.getElementById('cart-empty');
const cartFooterEl  = document.getElementById('cart-footer');
const cartCountEl   = document.getElementById('cart-count');
const cartSubtotal  = document.getElementById('cart-subtotal');
const productGrid   = document.getElementById('product-grid');
const noResults     = document.getElementById('no-results');
const productModal  = document.getElementById('product-modal');
const modalClose    = document.getElementById('modal-close');
const toast         = document.getElementById('toast');
const searchToggle  = document.getElementById('search-toggle');
const searchBar     = document.getElementById('search-bar');
const searchInput   = document.getElementById('search-input');
const searchCloseBtn= document.getElementById('search-close');
const filterBtns    = document.querySelectorAll('.filter-btn');
const navLinks      = document.querySelectorAll('.nav-link[data-category]');
const sortSelect    = document.getElementById('sort-select');
const navToggle     = document.getElementById('nav-toggle');
const mainNav       = document.getElementById('main-nav');
const continueShop  = document.getElementById('continue-shopping');
const nlForm        = document.getElementById('newsletter-form');

// ---- Init ----
function init() {
  renderProducts();
  updateCartUI();

  // GA4: view_item_list on page load
  pushEvent('view_item_list', {
    ecommerce: {
      item_list_id: 'homepage',
      item_list_name: 'Homepage Collection',
      items: PRODUCTS.map((p, i) => formatItem(p, i))
    }
  });
}

// ============================================================
// PRODUCT RENDERING
// ============================================================
function getFilteredSorted() {
  let items = PRODUCTS.filter(p => {
    const matchCat = activeFilter === 'all' || p.category === activeFilter;
    const matchQ   = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery);
    return matchCat && matchQ;
  });

  if (activeSort === 'price-asc')  items = [...items].sort((a,b) => a.price - b.price);
  if (activeSort === 'price-desc') items = [...items].sort((a,b) => b.price - a.price);
  if (activeSort === 'name-asc')   items = [...items].sort((a,b) => a.name.localeCompare(b.name));

  return items;
}

function renderProducts() {
  const items = getFilteredSorted();
  productGrid.innerHTML = '';

  if (!items.length) {
    noResults.classList.remove('hidden');
    return;
  }
  noResults.classList.add('hidden');

  items.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      ${p.badge ? `<span class="product-badge badge-${p.badge.toLowerCase()}">${p.badge}</span>` : ''}
      <div class="product-card-img">
        <div class="img-fill" style="background:${p.bgColor};">${p.svgIcon}</div>
      </div>
      <div class="product-card-body">
        <div class="product-card-cat">${p.category}</div>
        <div class="product-card-name">${p.name}</div>
        <div class="product-card-price">
          ${p.originalPrice ? `<span class="original">$${p.originalPrice}</span><span class="sale">$${p.price}</span>` : `$${p.price}.00`}
        </div>
      </div>
      <div class="product-card-actions">
        <button class="btn btn-outline" data-quick-view="${p.id}">View</button>
        <button class="btn btn-primary" data-quick-add="${p.id}">Add to Cart</button>
      </div>
    `;
    productGrid.appendChild(card);

    // GA4: select_item on card click
    card.querySelector('[data-quick-view]').addEventListener('click', (e) => {
      e.stopPropagation();
      pushEvent('select_item', { ecommerce: { items: [formatItem(p, i)] } });
      openProductModal(p);
    });

    card.querySelector('[data-quick-add]').addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(p, 1, null);
    });
  });
}

// ============================================================
// PRODUCT MODAL
// ============================================================
function openProductModal(p) {
  currentProduct = p;
  currentQty = 1;

  document.getElementById('modal-category').textContent = p.category;
  document.getElementById('modal-name').textContent = p.name;
  document.getElementById('modal-price').textContent = p.originalPrice
    ? `$${p.price}.00  (was $${p.originalPrice}.00)`
    : `$${p.price}.00`;
  document.getElementById('modal-desc').textContent = p.description;
  document.getElementById('qty-value').textContent = '1';

  // Main image
  const imgEl = document.getElementById('modal-img');
  imgEl.innerHTML = `<div style="width:220px;height:220px;display:flex;align-items:center;justify-content:center;">${p.svgIcon.replace('width="80"','width="160"').replace('height="80"','height="160"')}</div>`;

  // Thumbnails (color swatches)
  const thumbsEl = document.getElementById('modal-thumbnails');
  thumbsEl.innerHTML = '';
  if (p.thumbColors) {
    p.thumbColors.forEach((c, i) => {
      const t = document.createElement('div');
      t.className = `modal-thumb${i===0?' active':''}`;
      t.style.background = c;
      t.addEventListener('click', () => {
        document.querySelectorAll('.modal-thumb').forEach(x=>x.classList.remove('active'));
        t.classList.add('active');
      });
      thumbsEl.appendChild(t);
    });
  }

  // Options (colors/sizes)
  const optsEl = document.getElementById('modal-options');
  optsEl.innerHTML = '';
  if (p.colors && p.colors.length > 1) {
    const label = document.createElement('label');
    label.textContent = 'Colour';
    const chips = document.createElement('div');
    chips.className = 'option-chips';
    p.colors.forEach((c, i) => {
      const chip = document.createElement('button');
      chip.className = `option-chip${i===0?' selected':''}`;
      chip.textContent = c;
      chip.addEventListener('click', () => {
        document.querySelectorAll('.option-chip').forEach(x=>x.classList.remove('selected'));
        chip.classList.add('selected');
      });
      chips.appendChild(chip);
    });
    optsEl.appendChild(label);
    optsEl.appendChild(chips);
  }

  // Meta
  const metaEl = document.getElementById('modal-meta');
  metaEl.innerHTML = p.meta.map(m=>`<li>${m}</li>`).join('');

  productModal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // GA4: view_item
  pushEvent('view_item', {
    ecommerce: {
      currency: 'USD',
      value: p.price,
      items: [formatItem(p, 0)]
    }
  });
}

function closeProductModal() {
  productModal.classList.remove('open');
  document.body.style.overflow = '';
  currentProduct = null;
}

modalClose.addEventListener('click', closeProductModal);
productModal.addEventListener('click', (e) => { if (e.target === productModal) closeProductModal(); });

// Qty controls
document.getElementById('qty-minus').addEventListener('click', () => {
  if (currentQty > 1) { currentQty--; document.getElementById('qty-value').textContent = currentQty; }
});
document.getElementById('qty-plus').addEventListener('click', () => {
  currentQty++;
  document.getElementById('qty-value').textContent = currentQty;
});

document.getElementById('modal-add-to-cart').addEventListener('click', () => {
  if (!currentProduct) return;
  const variant = document.querySelector('.option-chip.selected')?.textContent || null;
  addToCart(currentProduct, currentQty, variant);
  closeProductModal();
});

// ============================================================
// CART
// ============================================================
function addToCart(product, qty, variant) {
  const existing = cart.find(i => i.id === product.id && i.variant === variant);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, qty, variant,
      bgColor: product.bgColor, svgIcon: product.svgIcon });
  }
  saveCart();
  updateCartUI();
  openCart();
  showToast(`${product.name} added to cart`);

  // GA4: add_to_cart
  pushEvent('add_to_cart', {
    ecommerce: {
      currency: 'USD',
      value: product.price * qty,
      items: [{ ...formatItem(product, 0), quantity: qty, item_variant: variant || undefined }]
    }
  });
}

function removeFromCart(id, variant) {
  const item = cart.find(i => i.id === id && i.variant === variant);
  if (!item) return;

  // GA4: remove_from_cart
  pushEvent('remove_from_cart', {
    ecommerce: {
      currency: 'USD',
      value: item.price * item.qty,
      items: [{ item_id: id, item_name: item.name, price: item.price, quantity: item.qty }]
    }
  });

  cart = cart.filter(i => !(i.id === id && i.variant === variant));
  saveCart();
  updateCartUI();
}

function updateItemQty(id, variant, delta) {
  const item = cart.find(i => i.id === id && i.variant === variant);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('kova_cart', JSON.stringify(cart));
}

function cartTotal() {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function cartItemCount() {
  return cart.reduce((sum, i) => sum + i.qty, 0);
}

function updateCartUI() {
  const count = cartItemCount();
  const total = cartTotal();

  // Count badge
  cartCountEl.textContent = count;
  cartCountEl.classList.toggle('visible', count > 0);

  // Empty / filled state
  const isEmpty = cart.length === 0;
  cartItemsEl.classList.toggle('hidden', isEmpty);
  cartEmptyEl.classList.toggle('hidden', !isEmpty);
  cartFooterEl?.classList.toggle('hidden', isEmpty);

  // Subtotal
  if (cartSubtotal) cartSubtotal.textContent = `$${total.toFixed(2)}`;

  // Items
  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        <div style="width:70px;height:70px;background:${item.bgColor};border-radius:4px;display:flex;align-items:center;justify-content:center;">
          ${item.svgIcon}
        </div>
      </div>
      <div>
        <div class="cart-item-name">${item.name}</div>
        ${item.variant ? `<div class="cart-item-variant">${item.variant}</div>` : ''}
        <div class="cart-item-qty">
          <button onclick="updateItemQty('${item.id}','${item.variant||''}', -1)" aria-label="Decrease">−</button>
          <span>${item.qty}</span>
          <button onclick="updateItemQty('${item.id}','${item.variant||''}', 1)" aria-label="Increase">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.id}','${item.variant||''}')">Remove</button>
      </div>
      <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
    </div>
  `).join('');

  // Checkout link — pass cart to checkout page
  const checkoutLink = document.getElementById('checkout-link');
  if (checkoutLink) {
    checkoutLink.addEventListener('click', () => {
      // GA4: begin_checkout
      pushEvent('begin_checkout', {
        ecommerce: {
          currency: 'USD',
          value: total,
          items: cart.map(i => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.qty }))
        }
      });
    });
  }
}

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // GA4: view_cart
  pushEvent('view_cart', {
    ecommerce: {
      currency: 'USD',
      value: cartTotal(),
      items: cart.map(i => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.qty }))
    }
  });
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
if (continueShop) continueShop.addEventListener('click', closeCart);

// ============================================================
// SEARCH
// ============================================================
searchToggle.addEventListener('click', () => {
  searchBar.classList.add('open');
  searchInput.focus();
});
searchCloseBtn.addEventListener('click', () => {
  searchBar.classList.remove('open');
  searchInput.value = '';
  searchQuery = '';
  renderProducts();
});

let searchTimeout;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchQuery = searchInput.value.trim().toLowerCase();
    renderProducts();

    if (searchQuery) {
      // GA4: search
      pushEvent('search', { search_term: searchQuery });
    }
  }, 280);
});

document.getElementById('reset-search')?.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  renderProducts();
});

// ============================================================
// FILTER + SORT
// ============================================================
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderProducts();

    // GA4: view_item_list (filtered)
    pushEvent('view_item_list', {
      ecommerce: {
        item_list_id: `filter_${activeFilter}`,
        item_list_name: `Filter: ${activeFilter}`,
        items: getFilteredSorted().map((p,i) => formatItem(p,i))
      }
    });
  });
});

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const cat = link.dataset.category;
    activeFilter = cat;
    filterBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.filter === cat);
    });
    renderProducts();
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    if (mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
    }
  });
});

if (sortSelect) {
  sortSelect.addEventListener('change', () => {
    activeSort = sortSelect.value;
    renderProducts();
  });
}

// ============================================================
// MOBILE NAV
// ============================================================
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    mainNav.classList.toggle('open');
  });
}

// ============================================================
// HEADER SCROLL
// ============================================================
const siteHeader = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  siteHeader?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ============================================================
// LOGO
// ============================================================
document.getElementById('logo-link')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// NEWSLETTER
// ============================================================
if (nlForm) {
  nlForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('nl-email').value;
    if (!email) return;

    // GA4: generate_lead (newsletter signup)
    pushEvent('generate_lead', { method: 'newsletter', email_domain: email.split('@')[1] });

    showToast('You\'re on the list! 🎉');
    nlForm.reset();
  });
}

// ============================================================
// TOAST
// ============================================================
let toastTimeout;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============================================================
// GA4 ITEM FORMATTER
// ============================================================
function formatItem(p, index) {
  return {
    item_id:       p.id,
    item_name:     p.name,
    item_category: p.category,
    price:         p.price,
    index:         index,
    currency:      'USD'
  };
}

// ============================================================
// KEYBOARD CLOSE
// ============================================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProductModal();
    closeCart();
    searchBar.classList.remove('open');
  }
});

// ---- Boot ----
init();
