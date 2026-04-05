document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-cta, .footer-links a');
  const revealItems = document.querySelectorAll('.product-card, .feature, .gallery-item, .contact-box, .cart-panel, .cart-demo, .contact-panel, .order-form');
  const yearNode = document.querySelector('[data-current-year]');
  const searchInput = document.querySelector('[data-menu-search]');
  const filterButtons = document.querySelectorAll('[data-filter]');
  const menuCards = document.querySelectorAll('.menu-item');
  const menuCount = document.querySelector('[data-menu-count]');
  const menuAvgCarb = document.querySelector('[data-avg-carb]');
  const modal = document.querySelector('[data-modal]');
  const modalTitle = document.querySelector('[data-modal-title]');
  const modalDescription = document.querySelector('[data-modal-description]');
  const modalIngredients = document.querySelector('[data-modal-ingredients]');
  const modalCarb = document.querySelector('[data-modal-carb]');
  const cartButtons = document.querySelectorAll('[data-add-cart]');
  const cartItemsNode = document.querySelector('[data-cart-items]');
  const cartCountNode = document.querySelector('[data-cart-count]');
  const cartItemsTotalNode = document.querySelector('[data-cart-items-total]');
  const cartTotalNode = document.querySelector('[data-cart-total]');
  const cartCheckoutButton = document.querySelector('[data-cart-checkout]');
  const heroAnimatedLines = document.querySelectorAll('.hero-animated-title span');
  const contactCartList = document.querySelector('[data-contact-cart-list]');
  const contactCartEmpty = document.querySelector('[data-contact-cart-empty]');
  const orderItemsInput = document.querySelector('[data-order-items]');
  const orderMessageInput = document.querySelector('[data-order-message]');
  const themeToggle = document.querySelector('[data-theme-toggle]');

  const CART_KEY = 'laymanbekery-cart';
  const THEME_KEY = 'laymanbekery-theme';
  let cart = [];

  try {
    const savedCart = localStorage.getItem(CART_KEY);
    cart = savedCart ? JSON.parse(savedCart) : [];
  } catch {
    cart = [];
  }

  const saveCart = () => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage errors
    }
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode';
  };

  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, nextTheme);
      applyTheme(nextTheme);
    });
  }

  if (yearNode) yearNode.textContent = new Date().getFullYear();

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav?.classList.add('nav-active');
      setTimeout(() => nav?.classList.remove('nav-active'), 500);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));

  if (heroAnimatedLines.length) {
    heroAnimatedLines.forEach((line, index) => {
      line.style.setProperty('--line-delay', `${index * 140}ms`);
    });
  }

  const updateStats = () => {
    if (!menuCards.length) return;
    const visible = [...menuCards].filter((card) => card.dataset.visible !== 'false');
    const carbs = visible.map((card) => Number(card.dataset.carb || 0));
    const avg = carbs.length ? Math.round(carbs.reduce((a, b) => a + b, 0) / carbs.length) : 0;
    if (menuCount) menuCount.textContent = String(visible.length);
    if (menuAvgCarb) menuAvgCarb.textContent = `${avg}g`;
  };

  const applyFilters = (term = '', category = 'all') => {
    const q = term.trim().toLowerCase();
    menuCards.forEach((card) => {
      const haystack = (card.dataset.search || '').toLowerCase();
      const matchesTerm = !q || haystack.includes(q);
      const matchesCategory = category === 'all' || card.dataset.category === category;
      const show = matchesTerm && matchesCategory;
      card.dataset.visible = show ? 'true' : 'false';
      card.classList.toggle('is-hidden', !show);
    });
    updateStats();
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const active = document.querySelector('[data-filter].is-active')?.dataset.filter || 'all';
      applyFilters(e.target.value, active);
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('is-active'));
      button.classList.add('is-active');
      if (searchInput) applyFilters(searchInput.value, button.dataset.filter || 'all');
    });
  });

  document.querySelectorAll('[data-open-modal]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!modal) return;
      modal.hidden = false;
      if (modalTitle) modalTitle.textContent = button.dataset.title || 'Menu item';
      if (modalDescription) modalDescription.textContent = button.dataset.description || '';
      if (modalIngredients) modalIngredients.textContent = button.dataset.ingredients || '';
      if (modalCarb) modalCarb.textContent = button.dataset.carb || '';
      document.body.style.overflow = 'hidden';
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!modal) return;
      modal.hidden = true;
      document.body.style.overflow = '';
    });
  });

  const groupedCart = () =>
    cart.reduce((acc, item) => {
      const found = acc.find((entry) => entry.name === item.name);
      if (found) {
        found.qty += 1;
        found.total += item.price;
      } else {
        acc.push({ ...item, qty: 1, total: item.price });
      }
      return acc;
    }, []);

  const renderContactCart = () => {
    if (!contactCartList || !contactCartEmpty) return;
    const grouped = groupedCart();

    if (!grouped.length) {
      contactCartEmpty.hidden = false;
      contactCartList.innerHTML = '';
      if (orderItemsInput) orderItemsInput.value = '';
      if (orderMessageInput) orderMessageInput.value = '';
      return;
    }

    contactCartEmpty.hidden = true;
    contactCartList.innerHTML = grouped
      .map(
        (item) => `
          <div class="contact-cart-item">
            <strong>${item.name}</strong>
            <span>${item.qty} ชิ้น · ฿${item.total}</span>
          </div>
        `
      )
      .join('');

    if (orderItemsInput) {
      orderItemsInput.value = grouped.map((item) => `${item.name} ${item.qty} ชิ้น`).join(', ');
    }

    if (orderMessageInput) {
      const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
      orderMessageInput.value = `รายการจาก cart demo: ${grouped
        .map((item) => `${item.name} x${item.qty}`)
        .join(', ')} | ยอดรวมประมาณ ฿${totalPrice}`;
    }
  };

  const renderCart = () => {
    if (cartItemsNode && cartCountNode && cartItemsTotalNode && cartTotalNode) {
      if (!cart.length) {
        cartItemsNode.innerHTML = '<p class="cart-empty">ยังไม่มีสินค้าในตะกร้า ลองกด “Add to cart” ด้านล่างได้เลย</p>';
        cartCountNode.textContent = '0 items';
        cartItemsTotalNode.textContent = '0';
        cartTotalNode.textContent = '฿0';
      } else {
        const grouped = groupedCart();
        cartItemsNode.innerHTML = grouped
          .map(
            (item) => `
              <div class="cart-item-row">
                <div>
                  <strong>${item.name}</strong>
                  <span>${item.qty} x ฿${item.price}</span>
                </div>
                <strong>฿${item.total}</strong>
              </div>
            `
          )
          .join('');

        const totalItems = cart.length;
        const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
        cartCountNode.textContent = `${totalItems} item${totalItems > 1 ? 's' : ''}`;
        cartItemsTotalNode.textContent = String(totalItems);
        cartTotalNode.textContent = `฿${totalPrice}`;
      }
    }

    saveCart();
    renderContactCart();
  };

  cartButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const item = {
        name: button.dataset.name || 'Menu item',
        price: Number(button.dataset.price || 0),
      };
      cart.push(item);
      renderCart();
      button.textContent = 'Added ✓';
      button.classList.add('is-added');
      setTimeout(() => {
        button.textContent = 'Add to cart';
        button.classList.remove('is-added');
      }, 1100);
    });
  });

  if (cartCheckoutButton) {
    cartCheckoutButton.addEventListener('click', () => {
      if (!cart.length) {
        alert('ยังไม่มีสินค้าในตะกร้า ลองเลือกเมนูก่อนนะ');
        return;
      }
      const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
      alert(`Demo checkout สำเร็จ\nจำนวน ${cart.length} ชิ้น\nยอดรวม ฿${totalPrice}\nข้อมูลถูกเตรียมไว้ให้หน้า order form แล้ว`);
    });
  }

  const forms = document.querySelectorAll('.order-form');
  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = form.querySelector('[name="name"]')?.value || 'ลูกค้า';
      alert(`ขอบคุณ ${name} ที่สนใจสั่งซื้อ Laymanbekery \nเราจะติดต่อกลับโดยเร็วที่สุด`);
      form.reset();
    });
  });

  updateStats();
  renderCart();
});
