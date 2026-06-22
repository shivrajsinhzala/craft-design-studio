import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Footer({ simple = false }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleServiceClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.lenis?.scrollTo('#services');
    } else {
      navigate('/', { state: { scrollTo: '#services' } });
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
              <Link to="/project/flora-11">Flora 11</Link>
              <Link to="/project/golden-heights">Golden Heights</Link>
              <Link to="/project/silver-heights">Silver Heights</Link>
              <Link to="/project/office-design">Office Design</Link>
              <Link to="/project/sthapatya">Sthapatya</Link>
              <Link to="/project/twin-tower">Twin Tower</Link>
            </nav>
            <nav className="footer-col" aria-label="Studio navigation">
              <h5>Studio</h5>
              <Link to="/" onClick={() => window.lenis?.scrollTo(0)}>Home</Link>
              <a href="#about" onClick={(e) => { e.preventDefault(); navigate('/', { state: { scrollTo: '#about' } }) }}>About</a>
              <Link to="/blog">Blog &amp; Insights</Link>
              <a href="#contact" onClick={(e) => { e.preventDefault(); navigate('/', { state: { scrollTo: '#contact' } }) }}>Contact</a>
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
