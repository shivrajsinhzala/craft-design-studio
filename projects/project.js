/* Project page shared script — SEO/A11y optimized v4 */
'use strict';

// Init Lucide icons
if (window.lucide) lucide.createIcons();

// Cursor (desktop only)
const cursor = document.getElementById('cursor');
if (cursor && window.innerWidth >= 768) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
  document.querySelectorAll('a,button,.gallery-grid img').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('big'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
  });
}

// Hamburger with aria-expanded
const toggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// Lightbox
const lb    = document.getElementById('lb');
const lbImg = document.getElementById('lbImg');

function openLb(img) {
  if (!lb || !lbImg) return;
  lbImg.src = img.src;
  lbImg.alt = img.alt || 'Full size image';
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  // Focus trap: focus the close button
  const closeBtn = lb.querySelector('.lb-close');
  if (closeBtn) closeBtn.focus();
}

function closeLb() {
  if (!lb) return;
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (lb) {
  lb.addEventListener('click', e => { if (e.target === e.currentTarget) closeLb(); });
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

// Gallery image reveal animation
if (window.gsap) {
  const imgs = document.querySelectorAll('.gallery-grid img');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        gsap.from(e.target, { opacity: 0, y: 24, duration: 0.8, ease: 'power3.out' });
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  imgs.forEach(img => io.observe(img));
}
