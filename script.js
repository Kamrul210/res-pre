// ============================================================
// FOODIE HUB PREMIUM — SCRIPT
// ============================================================

const WHATSAPP = "8801XXXXXXXXX"; // Change to your number

// ===== CART =====
let cart = [];

function addToCart(item) {
  const existing = cart.find(c => c.name === item.name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCart();
  // Show cart
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
}

function updateCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCount').textContent = count;

  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');

  if (cart.length === 0) {
    itemsEl.innerHTML = '<div class="cart-empty"><i class="fas fa-bowl-food"></i><p>Your cart is empty</p></div>';
    footerEl.style.display = 'none';
    return;
  }

  footerEl.style.display = 'block';

  itemsEl.innerHTML = cart.map((item, idx) => `
    <div class="cart-item-row">
      <img class="cart-item-img" src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${item.price}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${idx}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${idx})"><i class="fas fa-trash"></i></button>
    </div>
  `).join('');

  // Calculate total
  const total = cart.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/[^\d]/g, ''));
    return sum + price * item.qty;
  }, 0);
  document.getElementById('cartTotal').textContent = `৳ ${total.toLocaleString()}`;
}

function changeQty(idx, dir) {
  cart[idx].qty += dir;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  updateCart();
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  updateCart();
}

function clearCart() {
  cart = [];
  updateCart();
}

function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

function sendCartToWhatsApp() {
  if (cart.length === 0) return;
  let msg = "Hi! I'd like to place an order:%0A%0A";
  cart.forEach(item => {
    msg += `▸ ${item.name} x${item.qty} — ${item.price}%0A`;
  });
  const total = cart.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/[^\d]/g, ''));
    return sum + price * item.qty;
  }, 0);
  msg += `%0A*Total: ৳ ${total.toLocaleString()}*%0A%0APlease confirm my order. Thank you!`;
  window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, '_blank');
}

// ===== RESERVATION =====
function sendReservation() {
  const name = document.getElementById('resName').value.trim();
  const phone = document.getElementById('resPhone').value.trim();
  const date = document.getElementById('resDate').value;
  const time = document.getElementById('resTime').value;
  const guests = document.getElementById('resGuests').value;
  const type = document.getElementById('resType') ? document.getElementById('resType').value : 'Regular Dining';
  const request = document.getElementById('resRequest').value.trim();

  if (!name || !phone || !date || !time) {
    alert('Please fill in all required fields!');
    return;
  }

  let msg = `Hi! I'd like to make a table reservation:%0A%0A`;
  msg += `👤 *Name:* ${name}%0A`;
  msg += `📞 *Phone:* ${phone}%0A`;
  msg += `📅 *Date:* ${date}%0A`;
  msg += `🕐 *Time:* ${time}%0A`;
  msg += `👥 *Guests:* ${guests}%0A`;
  msg += `🎉 *Occasion:* ${type}%0A`;
  if (request) msg += `📝 *Special Request:* ${request}%0A`;
  msg += `%0APlease confirm my reservation. Thank you!`;

  window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, '_blank');
}

// ===== HERO SLIDER =====
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');

function goSlide(n) {
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  currentSlide = (n + slides.length) % slides.length;
  if (slides[currentSlide]) slides[currentSlide].classList.add('active');
  if (dots[currentSlide]) dots[currentSlide].classList.add('active');
}
function changeSlide(dir) { goSlide(currentSlide + dir); }
if (slides.length > 0) setInterval(() => changeSlide(1), 5000);

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (cursor) { cursor.style.left = mx - 4 + 'px'; cursor.style.top = my - 4 + 'px'; }
});

// Scale up cursor on hover over clickable elements
document.addEventListener('mouseover', e => {
  const el = e.target.closest('a, button, input, select, textarea, label, [onclick]');
  if (el) {
    if (cursor) cursor.style.transform = 'scale(2.2)';
    if (ring) { ring.style.transform = 'scale(1.5)'; ring.style.borderColor = 'rgba(231,76,60,0.9)'; }
  }
});
document.addEventListener('mouseout', e => {
  const el = e.target.closest('a, button, input, select, textarea, label, [onclick]');
  if (el) {
    if (cursor) cursor.style.transform = 'scale(1)';
    if (ring) { ring.style.transform = 'scale(1)'; ring.style.borderColor = 'rgba(231,76,60,0.5)'; }
  }
});

function animRing() {
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  if (ring) { ring.style.left = rx - 17 + 'px'; ring.style.top = ry - 17 + 'px'; }
  requestAnimationFrame(animRing);
}
animRing();

// ===== SCROLL REVEAL =====
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  let current = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = current;
  }, 30);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.counter').forEach(animateCounter);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
const aboutSection = document.getElementById('about');
if (aboutSection) counterObs.observe(aboutSection);

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.style.boxShadow = window.scrollY > 60 ? '0 4px 24px rgba(0,0,0,0.15)' : '0 2px 16px rgba(0,0,0,0.08)';
});

// ===== MOBILE MENU =====
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

// ===== RENDER CATEGORY CARDS =====
function renderCategoryCards() {
  const grid = document.getElementById('categoriesGrid');
  if (!grid || typeof categories === 'undefined') return;
  grid.innerHTML = categories.map(cat => `
    <a href="category.html?cat=${cat.id}" class="cat-card reveal">
      <div class="cat-card-bg" style="background-image:url('${cat.bgImg}')"></div>
      <div class="cat-card-overlay"></div>
      <div class="cat-card-content">
        <span class="cat-emoji">${cat.emoji}</span>
        <div class="cat-name">${cat.name}</div>
        <div class="cat-desc">${cat.description}</div>
        <div class="cat-count"><i class="fas fa-utensils"></i> ${cat.items.length} items</div>
      </div>
    </a>`).join('');
  grid.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
}

// ===== RENDER FOOTER LINKS =====
function renderFooterLinks() {
  const el = document.getElementById('footerMenuLinks');
  if (!el || typeof categories === 'undefined') return;
  el.innerHTML = categories.slice(0, 8).map(cat =>
    `<li><a href="category.html?cat=${cat.id}">${cat.emoji} ${cat.name}</a></li>`
  ).join('');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderCategoryCards();
  renderFooterLinks();
  updateCart();
});

// ===== PDF MENU DOWNLOAD =====
function downloadMenuPDF(e) {
  e.preventDefault();
  const win = window.open('', '_blank');
  let html = `<!DOCTYPE html><html><head>
  <meta charset="UTF-8">
  <title>The Verdant — Full Menu</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,700&family=Jost:wght@400;600&display=swap');
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'Jost',sans-serif;color:#1a1a1a;background:white;padding:40px;}
    .header{text-align:center;border-bottom:2px solid #C9A84C;padding-bottom:28px;margin-bottom:36px;}
    .logo{font-family:'Cormorant Garamond',serif;font-size:48px;font-weight:700;color:#1B4332;}
    .logo span{color:#C9A84C;font-style:italic;}
    .tagline{font-size:11px;letter-spacing:0.4em;text-transform:uppercase;color:#C9A84C;margin-top:6px;}
    .category{margin-bottom:36px;page-break-inside:avoid;}
    .cat-title{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:700;color:#1B4332;border-left:4px solid #C9A84C;padding-left:14px;margin-bottom:16px;}
    .items{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
    .item{background:#FAF7F0;border-radius:8px;padding:14px 16px;border:1px solid #E5DDD0;}
    .item-name{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:700;color:#0D1B12;}
    .item-desc{font-size:11px;color:#6B7280;margin-top:3px;line-height:1.5;}
    .item-price{font-size:17px;font-weight:700;color:#1B4332;margin-top:6px;}
    .footer{text-align:center;margin-top:48px;padding-top:20px;border-top:1px solid #E5DDD0;font-size:11px;color:#9CA3AF;letter-spacing:0.1em;}
  </style>
  </head><body>
  <div class="header">
    <div class="logo">The <span>Verdant</span></div>
    <div class="tagline">Premium Restaurant & Rooftop · Dinajpur, Bangladesh</div>
  </div>`;

  categories.forEach(cat => {
    html += `<div class="category"><div class="cat-title">${cat.emoji} ${cat.name}</div><div class="items">`;
    cat.items.forEach(item => {
      html += `<div class="item">
        <div class="item-name">${item.name}</div>
        <div class="item-desc">${item.desc}</div>
        <div class="item-price">${item.price}</div>
      </div>`;
    });
    html += `</div></div>`;
  });

  html += `<div class="footer">© 2025 The Verdant Restaurant · 8801830244478 · Dinajpur, Bangladesh</div></body></html>`;
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 800);
}
