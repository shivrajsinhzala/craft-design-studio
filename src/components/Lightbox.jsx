import React, { useEffect, useRef } from 'react';

export default function Lightbox({ isOpen, images = [], activeIndex = -1, onPrev, onNext, onClose }) {
  const closeBtnRef = useRef(null);

  const hasMultiple = images.length > 1;
  const currentImg = activeIndex > -1 ? images[activeIndex] : null;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
      if (closeBtnRef.current) {
        setTimeout(() => closeBtnRef.current?.focus(), 50);
      }
    } else {
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    }

    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && hasMultiple && onPrev) {
        onPrev();
      } else if (e.key === 'ArrowRight' && hasMultiple && onNext) {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    };
  }, [isOpen, onClose, hasMultiple, onPrev, onNext]);

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

      {hasMultiple && (
        <>
          <button
            className="lb-nav-btn lb-prev"
            onClick={onPrev}
            aria-label="Previous image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            className="lb-nav-btn lb-next"
            onClick={onNext}
            aria-label="Next image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {currentImg && (
        <div className="lb-content-wrap">
          <img className="lb-img" id="lbImg" src={currentImg.src} alt={currentImg.alt || 'Full size project image'} />
          {currentImg.alt && <p className="lb-caption">{currentImg.alt}</p>}
        </div>
      )}
    </div>
  );
}
