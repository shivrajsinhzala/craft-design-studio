import React, { useState, useEffect, useRef } from 'react';
// using window.location instead of react-router-dom
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const navRef = useRef(null);
  const [pathname, setPathname] = useState('/');
  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const navLinks = [
    { name: 'About', target: '/about', isExternal: true },
    { name: 'Services', target: '#services' },
    { name: 'Projects', target: '#projects' },
    { name: 'Process', target: '#process' },
    { name: 'Blog', target: '/blog', isExternal: true },
    { name: 'Contact', target: '/contact', isExternal: true, isCta: true },
  ];

  // Scrolled state and show/hide on scroll
  useEffect(() => {
    let lastY = 0;
    const nav = navRef.current;

    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 60);

      if (nav) {
        if (y > 400 && y > lastY + 5) {
          nav.style.transform = 'translateY(-100%)';
        } else if (y < lastY - 5) {
          nav.style.transform = 'translateY(0)';
        }
      }
      lastY = y;
    };

    // Attach to Lenis if loaded, otherwise standard window scroll
    if (window.lenis) {
      window.lenis.on('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (window.lenis) {
        window.lenis.off('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // GSAP ScrollTrigger to track active section on Home page
  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection('projects'); // Default active on project pages
      return;
    }

    const triggers = [];
    const sections = document.querySelectorAll('section[id]');

    sections.forEach((section) => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveSection(`#${section.id}`),
        onEnterBack: () => setActiveSection(`#${section.id}`),
      });
      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [pathname]);

  // Toggle mobile navigation menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = !isOpen ? 'hidden' : '';
    if (window.lenis) {
      if (!isOpen) window.lenis.stop();
      else window.lenis.start();
    }
  };

  // Close mobile navigation menu
  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
    if (window.lenis) window.lenis.start();
  };

  // Handle navigation clicking
  const handleNavClick = (e, target, isExternal) => {
    closeMenu();

    if (isExternal) {
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
      return;
    }

    e.preventDefault();
    if (pathname === '/') {
      if (window.lenis) {
        window.lenis.scrollTo(target);
      } else {
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = `/#${target.replace('#', '')}`;
    }
  };

  return (
    <header
      ref={navRef}
      className={`nav ${isScrolled || pathname !== '/' ? 'scrolled' : ''} ${isOpen ? 'menu-open' : ''}`}
      role="banner"
    >
      <a href="/" onClick={closeMenu} className="nav-logo" aria-label="Craft The Design Studio – Home">
        <img src="/Logo.png" alt="Craft The Design Studio" width="138" height="46" />
      </a>

      <nav
        className={`nav-links ${isOpen ? 'open' : ''}`}
        id="navLinks"
        role="navigation"
        aria-label="Main navigation"
      >
        {navLinks.map((link) => {
          if (link.isExternal) {
            const isActive = pathname === link.target;
            return (
              <a
                key={link.name}
                href={link.target}
                onClick={(e) => handleNavClick(e, link.target, true)}
                className={`nav-lnk ${isActive ? 'active' : ''}`}
              >
                {link.name}
              </a>
            );
          }
          const isActive = activeSection === link.target;
          return (
            <a
              key={link.name}
              href={link.target}
              onClick={(e) => handleNavClick(e, link.target, false)}
              className={`nav-lnk ${link.isCta ? 'nav-cta' : ''} ${isActive ? 'active' : ''}`}
            >
              {link.name}
            </a>
          );
        })}
      </nav>

      <a
        href="https://instagram.com/craft_design_studio1"
        target="_blank"
        rel="noopener noreferrer"
        className="nav-ig"
        aria-label="Follow us on Instagram"
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
          className="lucide lucide-instagram"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      </a>

      <button
        className={`nav-toggle ${isOpen ? 'open' : ''}`}
        id="navToggle"
        onClick={toggleMenu}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        aria-controls="navLinks"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </button>
    </header>
  );
}
