import React from 'react';
// using window.location instead of react-router-dom

export default function Footer({ simple = false }) {
  const handleServiceClick = (e) => {
    e.preventDefault();
    if (window.location.pathname === '/') {
      window.lenis?.scrollTo('#services');
    } else {
      window.location.href = '/#services';
    }
  };

  if (simple) {
    return (
      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer-btm">
            <p>
              &copy; {new Date().getFullYear()} Craft – The Design Studio. All rights reserved.
              <a href="https://shivrajsinh.in" target="_blank" rel="noopener noreferrer" style={{ marginLeft: '12px', opacity: 0.65, textDecoration: 'underline' }}>Developed by shivrajsinh.in</a>
            </p>
            <p>Morbi &amp; Rajkot, Gujarat, India</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <img src="/Logo.png" alt="Craft The Design Studio" className="footer-logo" loading="lazy" width="156" height="50" />
            <p className="footer-tagline">your vision | our craft</p>
            <p className="footer-sub">Designing Interiors, Defining Elegance.</p>
            <a
              href="https://instagram.com/craft_design_studio1"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-ig"
              aria-label="Follow Craft Design Studio on Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span>@craft_design_studio1</span>
            </a>
          </div>
          <div className="footer-cols">
            <nav className="footer-col" aria-label="Services navigation">
              <h5>Services</h5>
              <a href="#services" onClick={handleServiceClick}>Interior Design</a>
              <a href="#services" onClick={handleServiceClick}>3D Interior Visualization</a>
              <a href="#services" onClick={handleServiceClick}>Architectural Visualization</a>
              <a href="#services" onClick={handleServiceClick}>3D Floor Plans</a>
              <a href="#services" onClick={handleServiceClick}>Animation Walkthroughs</a>
            </nav>
            <nav className="footer-col" aria-label="Projects navigation">
              <h5>Projects</h5>
              <a href="/project/flora-11">Flora 11</a>
              <a href="/project/golden-heights">Golden Heights</a>
              <a href="/project/silver-heights">Silver Heights</a>
              <a href="/project/office-design">Office Design</a>
              <a href="/project/sthapatya">Sthapatya</a>
              <a href="/project/twin-tower">Twin Tower</a>
            </nav>
            <nav className="footer-col" aria-label="Studio navigation">
              <h5>Studio</h5>
              <a href="/" onClick={(e) => { e.preventDefault(); window.lenis?.scrollTo(0); window.location.href='/'; }}>Home</a>
              <a href="/about">About</a>
              <a href="/blog">Blog &amp; Insights</a>
              <a href="/contact">Contact</a>
            </nav>
            <div className="footer-col">
              <h5>Locations</h5>
              <address>
                <p>Shreeji Arcade, Sanala Road,<br />Morbi – 363641</p>
                <br />
                <p>Kataria Chowkdi,<br />Rajkot, Gujarat</p>
              </address>
            </div>
          </div>
        </div>
        <div className="footer-btm">
          <p>
            &copy; {new Date().getFullYear()} Craft – The Design Studio. All rights reserved.
            <a href="https://shivrajsinh.in" target="_blank" rel="noopener noreferrer" style={{ marginLeft: '12px', opacity: 0.65, textDecoration: 'underline' }}>Developed by shivrajsinh.in</a>
          </p>
          <p>Morbi &amp; Rajkot, Gujarat, India</p>
        </div>
      </div>
    </footer>
  );
}
