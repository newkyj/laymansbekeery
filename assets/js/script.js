document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-cta, .footer-links a');
  const revealItems = document.querySelectorAll('.product-card, .feature, .gallery-item, .contact-box');
  const yearNode = document.querySelector('[data-current-year]');
  const searchInput = document.querySelector('[data-menu-search]');
  const filterButtons = document.querySelectorAll('[data-filter]');
  const menuCards = document.querySelectorAll('.menu-item');
  const menuCount = document.querySelector('[data-menu-count]');
  const menuAvgCarb = document.querySelector('[data-avg-carb]');
  const menuGrid = document.querySelector('[data-menu-grid]');
  const modal = document.querySelector('[data-modal]');
  const modalTitle = document.querySelector('[data-modal-title]');
  const modalDescription = document.querySelector('[data-modal-description]');
  const modalIngredients = document.querySelector('[data-modal-ingredients]');
  const modalCarb = document.querySelector('[data-modal-carb]');

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
      const matchesTerm = !q || card.dataset.search?.includes(q);
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
      modalTitle.textContent = button.dataset.title || 'Menu item';
      modalDescription.textContent = button.dataset.description || '';
      modalIngredients.textContent = button.dataset.ingredients || '';
      modalCarb.textContent = button.dataset.carb || '';
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
});
