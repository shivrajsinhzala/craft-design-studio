import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Cursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
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
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });

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

    // Event delegation for hover states
    const hoverSelectors = 'a, button, .proj-card, .svc-row, .founder-card, .c-loc, .gallery-grid img';
    const magneticSelectors = '.btn-dark, .btn-ghost, .nav-lnk, .proj-arrow-wrap, .proj-nav-all';

    let activeMagnetic = null;

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
      btn.removeEventListener('mousemove', onBtnMouseMove);
      btn.removeEventListener('mouseleave', onBtnMouseLeave);
      if (activeMagnetic === btn) {
        activeMagnetic = null;
      }
    };

    const onMouseOver = (e) => {
      if (!e.target || typeof e.target.closest !== 'function') return;

      // Scale cursor up on hover targets
      if (e.target.closest(hoverSelectors)) {
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
      if (!e.relatedTarget || typeof e.relatedTarget.closest !== 'function' || !e.relatedTarget.closest(hoverSelectors)) {
        el.classList.remove('big');
      }
    };

    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });

    // Clean up
    return () => {
      isMounted = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
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

  return <div className="cursor" ref={cursorRef} aria-hidden="true" />;
}
