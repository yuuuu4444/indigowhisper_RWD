// ====================================================
// 统一版 JavaScript (分区整理)
// ====================================================
// 常量
const MOBILE_BREAKPOINT = 768;

// ====================================================
// 1. Header / 导航相关功能
// ====================================================
function hamburger() {
  const hamburger = document.querySelector('.hamburger');
  const nav       = document.getElementById('nav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    nav.classList.toggle('mobile-active');
    hamburger.classList.toggle('active');
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= MOBILE_BREAKPOINT) {
      nav.classList.remove('mobile-active');
      hamburger.classList.remove('active');
    }
  });
}

function search() {
  const modal  = document.getElementById('searchModal');
  const btn    = document.getElementById('searchBtn');
  const close  = document.querySelector('.closeBtn');
  const input  = document.getElementById('searchInput');
  const submit = document.getElementById('searchSubmit');
  if (!modal || !btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'block';
    setTimeout(() => input?.focus(), 100);
  });
  close.addEventListener('click', () => (modal.style.display = 'none'));
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submit.click();
  });
  submit.addEventListener('click', () => {
    const kw = input.value.trim();
    if (kw) {
      modal.style.display = 'none';
      input.value = '';
    } else alert('請輸入關鍵字');
  });
}

function toggleHeader() {
  const nav = document.getElementById('nav');
  const header = document.getElementById('header');
  const threshold = 800;
  const update = () => {
    if (window.innerWidth >= MOBILE_BREAKPOINT && window.scrollY >= threshold) {
      nav.classList.add('is-visible');
      header.classList.add('is-visible');
    } else {
      nav.classList.remove('is-visible');
      header.classList.remove('is-visible');
    }
  };
  update();
  window.addEventListener('scroll', update);
  window.addEventListener('resize', update);
}

// ====================================================
// 2. Banner 缩放 & Slider
// ====================================================
function handleBannerScale() {
  const wrap = document.querySelector('.bannerScaleWrap');
  const sec  = document.querySelector('.bannerSection');
  if (!wrap || !sec) return;
  const w = window.innerWidth;
  if (w >= 768 && w <= 1919) {
    const r = w / 1920;
    wrap.style.transform = `scale(${r})`;
    sec.style.height = `${1000 * r}px`;
  } else if (w >= 1920) {
    wrap.style.transform = 'scale(1)';
    sec.style.height = '1000px';
  } else {
    wrap.style.transform = '';
    sec.style.height = '';
  }
}

function slider() {
  const track = document.querySelector('.slideTrack');
  if (!track) return;
  const origin = Array.from(track.children);

  Promise.all(
    Array.from(track.querySelectorAll('img')).map((img) =>
      img.complete ? Promise.resolve() : new Promise((res) => (img.onload = img.onerror = res))
    )
  ).then(() => {
    const prepend = origin.map((n) => n.cloneNode(true)).reverse();
    const append  = origin.map((n) => n.cloneNode(true));
    prepend.forEach((n) => track.insertBefore(n, track.firstChild));
    append.forEach((n) => track.appendChild(n));

    const oneRoundWidth = () =>
      origin.reduce((sum, el) => {
        const rect = el.getBoundingClientRect();
        const st   = getComputedStyle(el);
        return sum + rect.width + parseFloat(st.marginLeft) + parseFloat(st.marginRight);
      }, 0);

    let one = oneRoundWidth();
    let off = -one;
    const speed = () => (window.innerWidth < 768 ? 50 : Math.min(100, 50 + (window.innerWidth - 768) * 0.2));
    let v = speed();
    window.addEventListener('resize', () => {
      v   = speed();
      one = oneRoundWidth();
    });

    let last = performance.now();
    function raf(now) {
      const dt = now - last;
      last = now;
      off -= (v * dt) / 1000;
      if (off <= -one * 2) off += one;
      if (off >= 0) off -= one;
      track.style.transform = `translateX(${off}px)`;
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  });
}

// ====================================================
// 3. Shop：分類選單 (桌機 + 手機 clone)
// ====================================================
function handleSidebarClone() {
  const sidebar  = document.querySelector('.sidebarFilters');
  const menuList = document.querySelector('.menuList');
  if (!sidebar || !menuList) return;

  const existing = menuList.querySelector('.mobile-cloned-sidebar');
  if (window.innerWidth < MOBILE_BREAKPOINT) {
    if (!existing) {
      const clone = sidebar.cloneNode(true);
      clone.classList.add('mobile-cloned-sidebar');
      menuList.appendChild(clone);
    }
  } else {
    existing?.remove();
  }
}

function initShopMenu(root = document) {
  root.querySelectorAll('.categoryToggleBtn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item  = btn.closest('.filterCategoryItem');
      const submenu = item.querySelector('.subMenu');
      const arrow   = btn.querySelector('.arrowIcon');
      item.classList.toggle('active');
      if (item.classList.contains('active')) {
        submenu.style.maxHeight = submenu.scrollHeight + 'px';
        arrow.style.transform   = 'rotate(180deg)';
      } else {
        submenu.style.maxHeight = '0';
        arrow.style.transform   = 'rotate(0deg)';
      }
    });
  });
}

// ====================================================
// 4. Shop：愛心收藏（事件委派）
// ====================================================
function initWishlist() {
  const container = document.querySelector('.productCardList') || document.body;
  container.addEventListener('click', (e) => {
    const heartSpan = e.target.closest('.heart');
    if (!heartSpan) return;
    const icon = heartSpan.querySelector('i');
    if (!icon) return;
    icon.classList.toggle('fa-regular');
    icon.classList.toggle('fa-solid');
  });
}

// ====================================================
// 5. Product：數量加減
// ====================================================
function initQuantityControls() {
  const amountInput = document.getElementById('amount');
  const minus = document.querySelector('.minus');
  const plus  = document.querySelector('.plus');
  if (!amountInput || !minus || !plus) return;

  minus.addEventListener('click', () => {
    const val = parseInt(amountInput.value, 10);
    if (val > parseInt(amountInput.min, 10)) amountInput.value = val - 1;
  });
  plus.addEventListener('click', () => {
    const val = parseInt(amountInput.value, 10);
    if (val < parseInt(amountInput.max, 10)) amountInput.value = val + 1;
  });
}

// ====================================================
// 6. 初始化
// ====================================================
function init() {
  // 基本 Header/Banner/Slider
  hamburger();
  search();
  toggleHeader();
  handleBannerScale();
  slider();

  // Shop 相關
  handleSidebarClone();
  initShopMenu();           // 綁桌機 + 手機 clone
  initWishlist();           // 愛心收藏
  initQuantityControls();   // 數量加減
}

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', () => {
    handleBannerScale();
    handleSidebarClone();
});
