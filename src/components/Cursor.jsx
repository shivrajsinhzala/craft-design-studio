import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

export default function Cursor() {
  const cursorRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (window.innerWidth < 768) return;

    const el = cursorRef.current;
    if (!el) return;

    let mx = 0, my = 0;
    let cx = 0, cy = 0;
    let isMounted = true;

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const onMouseDown = () => el.classList.add('small');
    const onMouseUp = () => el.classList.remove('small');

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Smooth lerp loop
    const tick = () => {
      if (!isMounted) return;
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      el.style.left = `${cx}px`;
      el.style.top = `${cy}px`;
      requestAnimationFrame(tick);
    };
    tick();

    // Clean up
    return () => {
      isMounted = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // Handle magnetic pull and scale effects (refreshes on route change)
  useEffect(() => {
    if (window.innerWidth < 768) return;

    const el = cursorRef.current;
    if (!el) return;

    // Hover scale effects (.big)
    const addHoverClass = () => el.classList.add('big');
    const removeHoverClass = () => el.classList.remove('big');

    const hoverSelectors = 'a, button, .proj-card, .svc-row, .founder-card, .c-loc, .gallery-grid img';
    const hoverTargets = document.querySelectorAll(hoverSelectors);
    hoverTargets.forEach((t) => {
      t.addEventListener('mouseenter', addHoverClass);
      t.addEventListener('mouseleave', removeHoverClass);
    });

    // Magnetic pull effects
    const magneticSelectors = '.btn-dark, .btn-ghost, .nav-lnk, .proj-arrow-wrap, .proj-nav-all';
    const magneticTargets = document.querySelectorAll(magneticSelectors);

    const onBtnMouseMove = (e) => {
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const bx = e.clientX - rect.left - rect.width / 2;
      const by = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: bx * 0.2, y: by * 0.2, duration: 0.4, ease: 'power3.out' });
    };

    const onBtnMouseLeave = (e) => {
      const btn = e.currentTarget;
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    };

    magneticTargets.forEach((btn) => {
      btn.addEventListener('mousemove', onBtnMouseMove);
      btn.addEventListener('mouseleave', onBtnMouseLeave);
    });

    return () => {
      el.classList.remove('big'); // Reset cursor state
      hoverTargets.forEach((t) => {
        t.removeEventListener('mouseenter', addHoverClass);
        t.removeEventListener('mouseleave', removeHoverClass);
      });
      magneticTargets.forEach((btn) => {
        btn.removeEventListener('mousemove', onBtnMouseMove);
        btn.removeEventListener('mouseleave', onBtnMouseLeave);
        // Reset translation state
        gsap.killTweensOf(btn);
        gsap.set(btn, { x: 0, y: 0 });
      });
    };
  }, [location]);

  if (window.innerWidth < 768) return null;

  return <div className="cursor" ref={cursorRef} aria-hidden="true" />;
}
