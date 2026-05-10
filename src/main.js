import './style.css'

const API_URL = import.meta.env.PROD ? '/api/submit-lead' : 'http://localhost:3000/api/submit-lead';

// ===== Form Handling =====
function setupForm(formId, successId) {
  const form = document.getElementById(formId);
  if (!form) return;

  let successElement = null;
  if (successId) {
    successElement = document.getElementById(successId);
  } else {
    const card = form.closest('.hero-form-card');
    if (card) {
      successElement = card.querySelector('.form-success');
    }
  }

  const btn = form.querySelector('.btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (btn) btn.classList.add('loading');

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (btn) btn.classList.remove('loading');

      if (response.ok) {
        form.style.display = 'none';
        if (successElement) {
          successElement.classList.remove('hidden');
          successElement.classList.add('visible');
        }
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Please try again.'}`);
      }
    } catch (error) {
      if (btn) btn.classList.remove('loading');
      console.error('Error:', error);
      alert('Error submitting. Please try again or contact us directly.');
    }
  });
}

setupForm('contact-form', 'form-success');
setupForm('hero-form');

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== Scroll Reveal =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(
  el => revealObserver.observe(el)
);

// ===== Header Scroll =====
const header = document.querySelector('.header');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  header.classList.toggle('scrolled', scrollY > 80);
  header.classList.toggle('hidden', scrollY > lastScrollY && scrollY > 300);
  lastScrollY = scrollY;
}, { passive: true });

// ===== 3D Tilt on Service Cards =====
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * -10;
    const rotateY = ((x - rect.width / 2) / rect.width) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
  });
});

// ===== Counter Animation =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  if (!target) return;
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) counterObserver.observe(statsSection);
