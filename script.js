/* ════════════════════════════════════════════════
   CRAFT THE DESIGN STUDIO  |  script.js  v5
   - Awwwards-level animations
   - Rotated text reveals
   - Hero image parallax
   - Magnetic cursor
   - Smooth scroll reveals
   ════════════════════════════════════════════════ */
'use strict';

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════
   Step 1 — Add js-ready to body BEFORE
   anything else so CSS hides elements
   ══════════════════════════════════════ */
document.body.classList.add('js-ready');

/* ════════════════════════════════════════════════
   Step 2 — Boot
   ════════════════════════════════════════════════ */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

function boot() {
  if (window.lucide) lucide.createIcons();
  initLoader();
}

/* ════════════════════════════════════════════════
   LOADER
   ════════════════════════════════════════════════ */
function initLoader() {
  const loader = document.getElementById('loader');
  const bar    = document.getElementById('loaderBar');
  if (!loader || !bar) { initAll(); return; }

  document.body.style.overflow = 'hidden';

  gsap.to(bar, {
    width: '100%',
    duration: 1.1,
    ease: 'power2.inOut',
    onComplete: () => {
      gsap.to(loader, {
        opacity: 0,
        duration: 0.45,
        ease: 'power2.in',
        onComplete: () => {
          loader.style.display = 'none';
          document.body.style.overflow = '';
          initAll();
        }
      });
    }
  });
}

/* ════════════════════════════════════════════════
   INIT ALL
   ════════════════════════════════════════════════ */
function initAll() {
  initCursor();
  initNav();
  initHamburger();
  initHeroAnim();
  initHeroParallax();
  initMarquee();
  initScrollReveals();
  initHScroll();
  initCounters();
  initForm();
  initActiveNav();
  initSmoothSections();
}

/* ════════════════════════════════════════════════
   MAGNETIC CURSOR (awwwards-style)
   ════════════════════════════════════════════════ */
function initCursor() {
  const el = document.getElementById('cursor');
  if (!el || window.innerWidth < 768) return;

  let mx = 0, my = 0;  // mouse position
  let cx = 0, cy = 0;  // cursor position (lerped)

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  // Smooth cursor follow with lerp
  (function tick() {
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    el.style.left = cx + 'px';
    el.style.top  = cy + 'px';
    requestAnimationFrame(tick);
  })();

  document.addEventListener('mousedown', () => el.classList.add('small'));
  document.addEventListener('mouseup',   () => el.classList.remove('small'));

  // Magnetic effect on interactive elements
  document.querySelectorAll('a,button,.proj-card,.svc-row,.founder-card,.c-loc').forEach(t => {
    t.addEventListener('mouseenter', () => el.classList.add('big'));
    t.addEventListener('mouseleave', () => el.classList.remove('big'));
  });

  // Magnetic pull on buttons/links
  document.querySelectorAll('.btn-dark, .btn-ghost, .nav-lnk, .proj-arrow-wrap').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const bx = e.clientX - rect.left - rect.width / 2;
      const by = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: bx * 0.2, y: by * 0.2, duration: 0.4, ease: 'power3.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ════════════════════════════════════════════════
   NAVBAR (scroll detection)
   ════════════════════════════════════════════════ */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  let lastY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    // Hide nav on scroll down, show on scroll up
    if (y > 400 && y > lastY) {
      nav.style.transform = 'translateY(-100%)';
    } else {
      nav.style.transform = 'translateY(0)';
    }
    lastY = y;
  }, { passive: true });
}

/* ════════════════════════════════════════════════
   HAMBURGER
   ════════════════════════════════════════════════ */
function initHamburger() {
  const btn   = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open navigation menu');
      document.body.style.overflow = '';
    });
  });
}

/* ════════════════════════════════════════════════
   HERO ANIMATION — Awwwards-level entrance
   Rotated text reveal + image scale + stagger
   ════════════════════════════════════════════════ */
function initHeroAnim() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.05 });

  // Rotated line-by-line text reveal
  const heroLines = document.querySelectorAll('.hero .rli');
  if (heroLines.length) {
    tl.to(heroLines, {
      y: '0%',
      rotation: 0,
      duration: 1.3,
      stagger: 0.08,
      ease: 'expo.out'
    }, 0);
  }

  // Eyebrow fade-slide
  const eyebrow = document.querySelector('.eyebrow-inner');
  if (eyebrow) tl.to(eyebrow, { y: '0%', opacity: 1, duration: 1.0, ease: 'expo.out' }, 0.2);

  // Actions slide up + fade
  const actions  = document.querySelector('.hero-actions');
  const location = document.querySelector('.hero-location');
  if (actions)  tl.to(actions,  { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.5);
  if (location) tl.to(location, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 0.6);

  // Image wipe + scale reveal
  const frame = document.getElementById('heroFrame');
  const heroImg = document.querySelector('.hero-img');
  if (frame) {
    tl.to(frame, { clipPath: 'inset(0 0 0% 0)', duration: 1.5, ease: 'expo.inOut' }, 0);
  }
  if (heroImg) {
    tl.to(heroImg, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0.3);
  }

  // Float tag
  const tag = document.getElementById('heroTag');
  if (tag) tl.to(tag, { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out' }, 0.9);

  // Hero bottom stats — stagger in
  const stats = document.querySelectorAll('.hero-stat');
  if (stats.length) {
    gsap.set(stats, { opacity: 0, y: 20 });
    tl.to(stats, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, 0.8);
  }
}

/* ════════════════════════════════════════════════
   HERO PARALLAX — Image moves on scroll
   ════════════════════════════════════════════════ */
function initHeroParallax() {
  const heroImg = document.querySelector('.hero-img');
  const heroRight = document.querySelector('.hero-right');
  if (!heroImg || !heroRight) return;

  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.2,
    animation: gsap.to(heroImg, {
      y: 80,
      scale: 1.1,
      ease: 'none'
    })
  });

  // Hero text parallax (moves up faster)
  const heroLeft = document.querySelector('.hero-left');
  if (heroLeft) {
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.8,
      animation: gsap.to(heroLeft, {
        y: -60,
        ease: 'none'
      })
    });
  }
}

/* ════════════════════════════════════════════════
   MARQUEE (smooth RAF loop)
   ════════════════════════════════════════════════ */
function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track || !track.parentElement) return;

  const clone = track.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  track.parentElement.appendChild(clone);

  track.style.willChange = 'transform';
  clone.style.willChange = 'transform';

  let pos = 0;
  const speed = 0.5;
  let w = track.offsetWidth;

  clone.style.transform = `translateX(${w}px)`;

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { w = track.offsetWidth; }, 150);
  }, { passive: true });

  (function loop() {
    pos -= speed;
    if (Math.abs(pos) >= w) pos += w;
    track.style.transform = `translateX(${pos}px)`;
    clone.style.transform = `translateX(${pos + w}px)`;
    requestAnimationFrame(loop);
  })();
}

/* ════════════════════════════════════════════════
   SCROLL REVEALS  (ScrollTrigger — rich staggered)
   ════════════════════════════════════════════════ */
function initScrollReveals() {

  /* ── clip-path image reveals ── */
  document.querySelectorAll('.clip-reveal').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => gsap.to(el, { clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'expo.inOut' }),
      once: true
    });
  });

  /* ── section titles — rotated line reveal ── */
  document.querySelectorAll('.section-title').forEach(title => {
    const lines = title.querySelectorAll('.rli');
    if (!lines.length) return;
    ScrollTrigger.create({
      trigger: title,
      start: 'top 85%',
      onEnter: () => gsap.to(lines, {
        y: '0%', rotation: 0,
        duration: 1.2, stagger: 0.08, ease: 'expo.out'
      }),
      once: true
    });
  });

  /* ── generic fade-ups ── */
  document.querySelectorAll('.reveal-up').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }),
      once: true
    });
  });

  /* ── service rows — staggered with slight rotation ── */
  document.querySelectorAll('.reveal-svc').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => gsap.to(el, {
        opacity: 1, y: 0,
        duration: 0.85,
        delay: i * 0.06,
        ease: 'expo.out'
      }),
      once: true
    });
  });

  /* ── process rows ── */
  document.querySelectorAll('.reveal-proc').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => gsap.to(el, {
        opacity: 1, x: 0,
        duration: 0.9,
        delay: i * 0.08,
        ease: 'expo.out'
      }),
      once: true
    });
  });

  /* ── about images ── */
  document.querySelectorAll('.ab-img').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => gsap.from(el, { opacity: 0, y: 50, duration: 1.1, delay: i * 0.15, ease: 'expo.out' }),
      once: true
    });
  });

  /* ── Labels ── */
  document.querySelectorAll('.label').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => gsap.from(el, { opacity: 0, x: -20, duration: 0.8, ease: 'expo.out' }),
      once: true
    });
  });

  /* ── Founder cards ── */
  document.querySelectorAll('.founder-card').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => gsap.from(el, { opacity: 0, x: -30, duration: 0.8, delay: i * 0.12, ease: 'expo.out' }),
      once: true
    });
  });

  /* ── Contact form slide up ── */
  const form = document.querySelector('.c-form');
  if (form) {
    ScrollTrigger.create({
      trigger: form,
      start: 'top 85%',
      onEnter: () => gsap.from(form, { opacity: 0, y: 40, duration: 1.0, ease: 'expo.out' }),
      once: true
    });
  }

  /* ── Location cards ── */
  document.querySelectorAll('.c-loc').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => gsap.from(el, { opacity: 0, y: 20, duration: 0.7, delay: i * 0.1, ease: 'expo.out' }),
      once: true
    });
  });
}

/* ════════════════════════════════════════════════
   SMOOTH SECTION TRANSITIONS — Subtle skew on scroll
   ════════════════════════════════════════════════ */
function initSmoothSections() {
  document.querySelectorAll('.section').forEach(section => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'top 40%',
      scrub: 0.6,
      animation: gsap.fromTo(section.querySelector('.container') || section, 
        { y: 30 },
        { y: 0, ease: 'none' }
      )
    });
  });
}

/* ════════════════════════════════════════════════
   HORIZONTAL SCROLL  (GSAP ScrollTrigger pin)
   ════════════════════════════════════════════════ */
let hST = null;

function initHScroll() {
  buildHScroll();

  let debounce;
  window.addEventListener('resize', () => {
    clearTimeout(debounce);
    debounce = setTimeout(buildHScroll, 250);
  }, { passive: true });
}

function buildHScroll() {
  const pin   = document.getElementById('hPin');
  const track = document.getElementById('hTrack');
  if (!pin || !track) return;

  if (hST) { hST.kill(); hST = null; }
  gsap.set(track, { x: 0, clearProps: 'x' });

  const vw   = window.innerWidth;
  const dist = track.scrollWidth - vw + parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pad-h')) * 2;

  if (dist <= 0) return;

  hST = ScrollTrigger.create({
    trigger:          pin,
    pin:              true,
    anticipatePin:    1,
    scrub:            1.4,
    invalidateOnRefresh: true,
    end:              () => `+=${dist}`,
    animation: gsap.to(track, { x: -dist, ease: 'none' }),
  });
}

/* ════════════════════════════════════════════════
   ANIMATED COUNTERS
   ════════════════════════════════════════════════ */
function initCounters() {
  const els = document.querySelectorAll('.count-n[data-target]');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const target   = +entry.target.dataset.target;
      const duration = 1800;
      const t0       = performance.now();
      (function tick(now) {
        const p = Math.min((now - t0) / duration, 1);
        entry.target.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
        if (p < 1) requestAnimationFrame(tick);
        else entry.target.textContent = target;
      })(t0);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  els.forEach(el => io.observe(el));
}

/* ════════════════════════════════════════════════
   CONTACT FORM
   ════════════════════════════════════════════════ */
function initForm() {
  const form = document.getElementById('contactForm');
  const btn  = document.getElementById('submitBtn');
  const ok   = document.getElementById('formOk');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.name?.value.trim() || !form.email?.value.trim() || !form.message?.value.trim()) return;

    btn.disabled = true;
    const lbl = btn.querySelector('span');
    if (lbl) lbl.textContent = 'Sending…';

    await new Promise(r => setTimeout(r, 1400));

    if (lbl) lbl.textContent = '✓ Sent!';
    if (ok)  ok.style.display = 'block';

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      if (lbl) lbl.textContent = 'Send Message';
      if (ok)  ok.style.display = 'none';
    }, 4000);
  });
}

/* ════════════════════════════════════════════════
   ACTIVE NAV HIGHLIGHT
   ════════════════════════════════════════════════ */
function initActiveNav() {
  const links = document.querySelectorAll('.nav-lnk:not(.nav-cta)');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.remove('active'));
      const a = document.querySelector(`.nav-lnk[href="#${e.target.id}"]`);
      if (a) a.classList.add('active');
    });
  }, { threshold: 0.35 });
  document.querySelectorAll('section[id]').forEach(s => io.observe(s));
}
