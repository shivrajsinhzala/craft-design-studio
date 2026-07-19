import React from 'react';
// removed react-router-dom and helmet
import * as Lucide from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';

export default function NotFound() {
  return (
    <PageTransition>
      <div 
        style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: 'var(--bg)',
          padding: '0 var(--pad-h)',
          textAlign: 'center'
        }}
      >


        <div style={{ position: 'relative', width: '100%', maxWidth: '440px', margin: '0 auto' }}>
          {/* Subtle gold line accent */}
          <div 
            style={{ 
              width: '40px', 
              height: '2px', 
              background: 'var(--yellow)', 
              margin: '0 auto 28px auto' 
            }} 
          />

          <h1 
            style={{ 
              fontFamily: 'var(--ff-mono)', 
              fontSize: '12px', 
              fontWeight: 500, 
              color: 'var(--yellow)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '16px'
            }}
          >
            Error Code 404
          </h1>

          <h2 
            style={{ 
              fontFamily: 'var(--ff-display)', 
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
              fontWeight: 300, 
              color: 'var(--dark)', 
              lineHeight: 1.1,
              marginBottom: '20px'
            }}
          >
            Page Not <span className="yellow-t">Found</span>
          </h2>

          <p 
            className="body-t" 
            style={{ 
              fontSize: '0.96rem', 
              lineHeight: 1.8, 
              color: 'var(--muted)',
              marginBottom: '36px' 
            }}
          >
            The link you followed may be broken, or the page has been moved or deleted. Let's get you back on track.
          </p>

          <a href="/" className="btn-dark" style={{ gap: '12px' }}>
            <Lucide.Home className="icon-xs" />
            <span>Back to Homepage</span>
          </a>
        </div>
      </div>
    </PageTransition>
  );
}
