import React, { useState, useEffect, useRef } from 'react';
import { 
  BUSINESS_CONFIG, 
  generateRandomReview 
} from '../data/reviewPhrases.js';
import { 
  Star, 
  MapPin, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  Sparkles,
  ClipboardCheck
} from 'lucide-react';

export default function ReviewGenerator() {
  // Generate on client mount to avoid SSR hydration mismatch
  const [reviewText, setReviewText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setReviewText(generateRandomReview());
  }, []);

  const handleShuffle = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setReviewText(generateRandomReview());
      setIsGenerating(false);
    }, 150);
  };

  // Robust clipboard copy with mobile fallback
  const copyToClipboard = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn('Navigator clipboard write failed, trying fallback execCommand', err);
      }
    }

    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    } catch (e) {
      console.error('All copy methods failed', e);
      return false;
    }
  };

  const handleLeaveReview = async () => {
    // 1. Copy review text to clipboard
    const success = await copyToClipboard(reviewText);
    if (success) {
      setIsCopied(true);
      setCopyFailed(false);
    } else {
      setCopyFailed(true);
    }

    // 2. Open Google Review URL
    // Some mobile browsers restrict popup windows if executed inside an async callback.
    // Try window.open first, fall back to window.location.href after brief confirmation.
    const reviewUrl = BUSINESS_CONFIG.googleReviewUrl;
    
    // Attempt window.open
    const newWindow = window.open(reviewUrl, '_blank', 'noopener,noreferrer');
    
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Popup was blocked or mobile device preferred direct navigation
      setTimeout(() => {
        window.location.href = reviewUrl;
      }, 700);
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsCopied(false);
    }, 4000);
  };

  return (
    <div className="review-page-wrapper">
      <div className="review-container">
        
        {/* Main Card */}
        <div className="review-card">
          
          {/* Business & Location Badge */}
          <div className="review-badge-group">
            <div className="review-location-badge">
              <MapPin className="review-badge-icon" />
              <span>{BUSINESS_CONFIG.verifiedBadge}</span>
            </div>
          </div>

          <h2 className="review-business-name">
            {BUSINESS_CONFIG.name}
          </h2>

          {/* 5 Big Glowing Gold Stars */}
          <div className="review-stars-wrapper" aria-label="5 out of 5 stars">
            {[1, 2, 3, 4, 5].map((starIndex) => (
              <Star
                key={starIndex}
                className="review-star-icon"
                fill="#E8B84B"
                stroke="#C69226"
                strokeWidth={1.5}
              />
            ))}
          </div>

          {/* Friendly Title & Subtitle */}
          <h1 className="review-title">
            How was our service?
          </h1>
          <p className="review-subtitle">
            We prepared a quick 5-star review for you. Just tap the button below and paste it on Google!
          </p>

          {/* Generated Review Box */}
          <div className="review-box-container">
            <div className="review-box-header">
              <div className="review-box-label">
                <ClipboardCheck className="review-label-icon" />
                <span>Auto-copies to your phone</span>
              </div>
              <button 
                type="button" 
                onClick={handleShuffle}
                className="review-shuffle-btn"
                title="Generate another variation"
                aria-label="Generate another review variation"
              >
                <RefreshCw className={`review-shuffle-icon ${isGenerating ? 'spin' : ''}`} />
                <span>Shuffle</span>
              </button>
            </div>

            <div className="review-text-bubble">
              <div className="quote-mark open">“</div>
              <p className="review-generated-text">
                {reviewText || "Outstanding experience with Craft Design Studio! Their 3D elevation renders gave us total clarity. Highly recommended for interior design!"}
              </p>
              <div className="quote-mark close">”</div>
            </div>
          </div>

          {/* Single Prominent Action Button */}
          <button
            type="button"
            onClick={handleLeaveReview}
            className={`review-cta-button ${isCopied ? 'copied-state' : ''}`}
            id="google-review-cta"
          >
            {isCopied ? (
              <span className="btn-content">
                <Check className="btn-icon check-icon" />
                <span>Copied! Opening Google... ✓</span>
              </span>
            ) : (
              <span className="btn-content">
                <span className="star-lead">⭐</span>
                <span>Leave 5-Star Review on Google</span>
                <ExternalLink className="btn-icon ext-icon" />
              </span>
            )}
          </button>

          {copyFailed && (
            <p className="copy-fallback-note">
              Note: If auto-copy was blocked by your browser, long-press the text above to copy, then paste on Google!
            </p>
          )}

          {/* Simple 2-Step Visual Guidance */}
          <div className="review-steps-box">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-text">
                <strong>Tap button above</strong>
                <span>(copies your review automatically)</span>
              </div>
            </div>
            
            <div className="step-divider" />

            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-text">
                <strong>Select 5 stars ⭐ on Google</strong>
                <span>&amp; <strong>Paste</strong> into the review box!</span>
              </div>
            </div>
          </div>

          {/* Small Trust Micro-Footer */}
          <div className="review-card-footer">
            <Sparkles className="footer-sparkle" />
            <span>Thank you for supporting Morbi &amp; Rajkot's local creative studio!</span>
          </div>

        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .review-page-wrapper {
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(180deg, #FBF9F5 0%, #F3EFE6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1rem;
          box-sizing: border-box;
          font-family: var(--ff-body, 'Inter', system-ui, sans-serif);
        }

        .review-container {
          width: 100%;
          max-width: 520px;
          margin: 0 auto;
        }

        .review-card {
          background: #FFFFFF;
          border-radius: 24px;
          padding: 2.5rem 2rem;
          box-shadow: 
            0 4px 6px -1px rgba(20, 18, 16, 0.03),
            0 20px 40px -8px rgba(20, 18, 16, 0.09),
            0 0 0 1px rgba(20, 18, 16, 0.06);
          text-align: center;
          position: relative;
          box-sizing: border-box;
        }

        .review-badge-group {
          display: flex;
          justify-content: center;
          margin-bottom: 0.75rem;
        }

        .review-location-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(232, 184, 75, 0.14);
          color: #8C6615;
          padding: 5px 14px;
          border-radius: 9999px;
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          border: 1px solid rgba(232, 184, 75, 0.35);
        }

        .review-badge-icon {
          width: 14px;
          height: 14px;
          color: #B2831E;
        }

        .review-business-name {
          font-family: var(--ff-display, 'Cormorant Garamond', Georgia, serif);
          font-size: 1.85rem;
          font-weight: 600;
          color: #141210;
          margin: 0 0 0.85rem 0;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .review-stars-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-bottom: 1.25rem;
        }

        .review-star-icon {
          width: 34px;
          height: 34px;
          filter: drop-shadow(0 3px 6px rgba(232, 184, 75, 0.45));
          animation: starGlow 2.5s ease-in-out infinite alternate;
        }

        @keyframes starGlow {
          0% {
            transform: scale(1);
            filter: drop-shadow(0 2px 4px rgba(232, 184, 75, 0.35));
          }
          100% {
            transform: scale(1.06);
            filter: drop-shadow(0 4px 10px rgba(232, 184, 75, 0.65));
          }
        }

        .review-title {
          font-family: var(--ff-display, 'Cormorant Garamond', Georgia, serif);
          font-size: 2.15rem;
          font-weight: 600;
          color: #141210;
          margin: 0 0 0.5rem 0;
          line-height: 1.15;
        }

        .review-subtitle {
          font-size: 0.95rem;
          line-height: 1.5;
          color: #655A4E;
          margin: 0 0 1.5rem 0;
          padding: 0 0.5rem;
        }

        .review-box-container {
          background: #FAF8F4;
          border: 1px solid rgba(20, 18, 16, 0.09);
          border-radius: 16px;
          padding: 1rem 1.15rem 1.15rem 1.15rem;
          margin-bottom: 1.5rem;
          text-align: left;
          position: relative;
        }

        .review-box-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px dashed rgba(20, 18, 16, 0.1);
        }

        .review-box-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #554A3E;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .review-label-icon {
          width: 14px;
          height: 14px;
          color: #E8B84B;
        }

        .review-shuffle-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.78rem;
          font-weight: 500;
          color: #7D7061;
          background: #FFFFFF;
          border: 1px solid rgba(20, 18, 16, 0.12);
          padding: 4px 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .review-shuffle-btn:hover {
          color: #141210;
          border-color: #E8B84B;
          background: #FFFDF9;
        }

        .review-shuffle-icon {
          width: 12px;
          height: 12px;
          transition: transform 0.3s ease;
        }

        .review-shuffle-icon.spin {
          animation: spinOnce 0.4s linear infinite;
        }

        @keyframes spinOnce {
          100% { transform: rotate(360deg); }
        }

        .review-text-bubble {
          position: relative;
          padding: 0 4px;
        }

        .quote-mark {
          font-family: Georgia, serif;
          font-size: 1.6rem;
          color: #E8B84B;
          line-height: 0;
          user-select: none;
        }
        .quote-mark.open {
          margin-bottom: 6px;
        }
        .quote-mark.close {
          text-align: right;
          margin-top: 8px;
        }

        .review-generated-text {
          font-size: 0.975rem;
          line-height: 1.6;
          color: #2A2520;
          font-style: italic;
          margin: 0;
          word-break: break-word;
        }

        .review-cta-button {
          width: 100%;
          min-height: 58px;
          background: #141210;
          color: #FFFFFF;
          border: 2px solid transparent;
          border-radius: 14px;
          padding: 14px 20px;
          font-size: 1.05rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 24px -6px rgba(20, 18, 16, 0.25);
          position: relative;
          box-sizing: border-box;
        }

        .review-cta-button:hover {
          background: #25221F;
          transform: translateY(-2px);
          box-shadow: 0 14px 28px -6px rgba(20, 18, 16, 0.35);
        }

        .review-cta-button:active {
          transform: translateY(0);
        }

        .review-cta-button.copied-state {
          background: #059669;
          border-color: #047857;
          box-shadow: 0 10px 24px -6px rgba(5, 150, 105, 0.4);
          transform: scale(1.02);
        }

        .btn-content {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
        }

        .star-lead {
          font-size: 1.25rem;
          line-height: 1;
        }

        .btn-icon {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        .ext-icon {
          opacity: 0.85;
        }

        .check-icon {
          stroke-width: 2.5;
        }

        .copy-fallback-note {
          font-size: 0.8rem;
          color: #B45309;
          margin-top: 0.75rem;
          line-height: 1.4;
        }

        .review-steps-box {
          margin-top: 1.75rem;
          background: #F8F6F1;
          border-radius: 14px;
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          text-align: left;
          border: 1px solid rgba(20, 18, 16, 0.06);
        }

        .step-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .step-number {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #E8B84B;
          color: #141210;
          font-weight: 700;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .step-text {
          font-size: 0.875rem;
          line-height: 1.4;
          color: #2A2520;
          display: flex;
          flex-direction: column;
        }

        .step-text strong {
          color: #141210;
          font-weight: 600;
        }

        .step-text span {
          color: #655A4E;
          font-size: 0.82rem;
          margin-top: 1px;
        }

        .step-divider {
          height: 1px;
          background: rgba(20, 18, 16, 0.08);
          width: 100%;
        }

        .review-card-footer {
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #8C7E6F;
          line-height: 1.4;
        }

        .footer-sparkle {
          width: 14px;
          height: 14px;
          color: #E8B84B;
          flex-shrink: 0;
        }

        @media (max-width: 480px) {
          .review-page-wrapper {
            padding: 1.25rem 0.75rem;
          }

          .review-card {
            padding: 2rem 1.25rem;
            border-radius: 20px;
          }

          .review-business-name {
            font-size: 1.6rem;
          }

          .review-title {
            font-size: 1.85rem;
          }

          .review-star-icon {
            width: 30px;
            height: 30px;
            gap: 6px;
          }

          .review-cta-button {
            font-size: 0.95rem;
            min-height: 54px;
            padding: 12px 14px;
          }

          .review-box-container {
            padding: 0.9rem;
          }

          .review-generated-text {
            font-size: 0.925rem;
          }
        }
      `}} />
    </div>
  );
}
