import React, { useEffect, useRef } from 'react';

export default function Lightbox({ isOpen, imgSrc, imgAlt, onClose }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
      if (closeBtnRef.current) {
        // Delay focus slightly to ensure the elements are visible
        setTimeout(() => closeBtnRef.current?.focus(), 50);
      }
    } else {
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`lb ${isOpen ? 'open' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      aria-hidden={!isOpen}
    >
      <button
        ref={closeBtnRef}
        className="lb-close"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" x2="6" y1="6" y2="18" />
          <line x1="6" x2="18" y1="6" y2="18" />
        </svg>
      </button>
      {imgSrc && (
        <img className="lb-img" id="lbImg" src={imgSrc} alt={imgAlt || 'Full size project image'} />
      )}
    </div>
  );
}
