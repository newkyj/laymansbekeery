document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      document.querySelector('.nav')?.classList.add('nav-active');
      setTimeout(() => {
        document.querySelector('.nav')?.classList.remove('nav-active');
      }, 500);
    });
  });

  const revealItems = document.querySelectorAll('.product-card, .feature, .gallery-item, .contact-box');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
});
