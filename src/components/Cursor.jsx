import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Cursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    // Only activate custom cursor on devices with fine pointer (mouse/trackpad)
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const el = cursorRef.current;
    if (!el) return;

    let mx = -100, my = -100;
    let cx = -100, cy = -100;
    let isMounted = true;
    let isVisible = false;

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!isVisible) {
        isVisible = true;
        el.classList.remove('hidden');
      }
    };

    const onMouseDown = () => el.classList.add('small');
    const onMouseUp = () => el.classList.remove('small');
    const onMouseLeave = () => {
      isVisible = false;
      el.classList.add('hidden');
    };
    const onMouseEnter = () => {
      isVisible = true;
      el.classList.remove('hidden');
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth lerp loop
    const tick = () => {
      if (!isMounted) return;
      cx += (mx - cx) * 0.15;
      cy += (my - cy) * 0.15;
      el.style.left = `${cx}px`;
      el.style.top = `${cy}px`;
      requestAnimationFrame(tick);
    };
    const rafId = requestAnimationFrame(tick);

    // Event delegation for hover states
    const hoverSelectors = 'a, button, .svc-row, .founder-card, .c-loc, .gallery-grid img, .faq-item';
    const magneticSelectors = '.btn-dark, .btn-ghost, .nav-lnk, .proj-arrow-wrap, .whatsapp-float, .hero-dot';

    let activeMagnetic = null;

    const onBtnMouseMove = (e) => {
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const bx = e.clientX - rect.left - rect.width / 2;
      const by = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: bx * 0.28, y: by * 0.28, duration: 0.3, ease: 'power2.out' });
    };

    const onBtnMouseLeave = (e) => {
      const btn = e.currentTarget;
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1.1, 0.4)' });
      btn.removeEventListener('mousemove', onBtnMouseMove);
      btn.removeEventListener('mouseleave', onBtnMouseLeave);
      if (activeMagnetic === btn) {
        activeMagnetic = null;
      }
    };

    const onMouseOver = (e) => {
      if (!e.target || typeof e.target.closest !== 'function') return;

      // Project card hover => view badge
      if (e.target.closest('.proj-card')) {
        el.classList.add('view-badge');
        el.classList.remove('big');
      } else if (e.target.closest(hoverSelectors)) {
        el.classList.remove('view-badge');
        el.classList.add('big');
      }

      // Attach magnetic behavior on mouseenter
      const targetMagnetic = e.target.closest(magneticSelectors);
      if (targetMagnetic && targetMagnetic !== activeMagnetic) {
        activeMagnetic = targetMagnetic;
        targetMagnetic.addEventListener('mousemove', onBtnMouseMove, { passive: true });
        targetMagnetic.addEventListener('mouseleave', onBtnMouseLeave);
      }
    };

    const onMouseOut = (e) => {
      if (!e.target || typeof e.target.closest !== 'function') return;

      // Scale cursor back down
      if (!e.relatedTarget || typeof e.relatedTarget.closest !== 'function' || !e.relatedTarget.closest('.proj-card')) {
        el.classList.remove('view-badge');
      }
      if (!e.relatedTarget || typeof e.relatedTarget.closest !== 'function' || !e.relatedTarget.closest(hoverSelectors)) {
        el.classList.remove('big');
      }
    };

    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });

    // Clean up
    return () => {
      isMounted = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      if (activeMagnetic) {
        activeMagnetic.removeEventListener('mousemove', onBtnMouseMove);
        activeMagnetic.removeEventListener('mouseleave', onBtnMouseLeave);
        gsap.killTweensOf(activeMagnetic);
        gsap.set(activeMagnetic, { x: 0, y: 0 });
      }
    };
  }, []);

  return <div className="cursor hidden" ref={cursorRef} aria-hidden="true" />;
}
