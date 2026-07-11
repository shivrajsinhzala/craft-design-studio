import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Navbar from './components/Navbar.jsx';
import Cursor from './components/Cursor.jsx';
import Home from './pages/Home.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import BlogList from './pages/BlogList.jsx';
import BlogDetail from './pages/BlogDetail.jsx';
import NotFound from './pages/NotFound.jsx';

gsap.registerPlugin(ScrollTrigger);

// ScrollToTop on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }
    // Refresh scroll triggers on page switch
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}

// Subcomponent to feed location key to AnimatePresence
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  useEffect(() => {
    // Progressive enhancement class
    document.body.classList.add('js-ready');

    // Init Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    window.lenis = lenis;

    // Connect Lenis to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Sync GSAP ticker with Lenis
    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      window.lenis = null;
      document.body.classList.remove('js-ready');
    };
  }, []);

  return (
    <Router>
      <Helmet>
        <title>Craft Design Studio | Designing Interiors, Defining Elegance</title>
        <meta name="description" content="Premium interior design, 3D visualization, architectural rendering, and animation walkthrough studio based in Morbi & Rajkot, Gujarat. Designing Interiors, Defining Elegance." />
        <link rel="canonical" href="https://craftdesignstudio.in/" />
        <meta property="og:image" content="https://craftdesignstudio.in/og-image.png" />
        <meta name="twitter:image" content="https://craftdesignstudio.in/og-image.png" />
        <link rel="shortcut icon" href="https://craftdesignstudio.in/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://craftdesignstudio.in/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="https://craftdesignstudio.in/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="https://craftdesignstudio.in/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="https://craftdesignstudio.in/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="144x144" href="https://craftdesignstudio.in/favicon-144x144.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="https://craftdesignstudio.in/favicon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="https://craftdesignstudio.in/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://craftdesignstudio.in/apple-touch-icon.png" />
      </Helmet>
      <ScrollToTop />
      <Cursor />
      <Navbar />
      <main id="main-content">
        <AnimatedRoutes />
      </main>
      
      {/* Floating WhatsApp Consultation Button */}
      <a
        href="https://wa.me/918758395671?text=Hi%20Craft%20Design%20Studio%2C%20I%20would%20like%20to%20consult%20for%20a%20design/visualization%20project."
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Chat on WhatsApp for a design consultation"
      >
        <span className="tooltip-text">Chat with Us</span>
        <svg
          viewBox="0 0 512 512"
          width="28"
          height="28"
          fill="currentColor"
          className="whatsapp-icon"
          aria-hidden="true"
        >
          <path d="M480 256C480 132.3 379.7 32 256 32S32 132.3 32 256c0 42.1 11.6 81.5 31.8 115L32 480l111.5-31.1c32.7 18.2 70.2 28.1 112.5 28.1 123.7 0 224-100.3 224-224zm-224 190.9c-34.7 0-68.7-9.3-98.3-26.9l-7-4.2-72.9 20.3 20.7-72.3-4.6-7.3c-19.3-30.7-29.5-66.1-29.5-102.5 0-106.1 86.4-192.5 192.5-192.5s192.5 86.4 192.5 192.5-86.4 192.5-192.5 192.5zm105.6-144.3c-5.8-2.9-34.2-16.9-39.5-18.8-5.3-1.9-9.2-2.9-13.1 2.9-3.9 5.8-15 18.8-18.4 22.7-3.4 3.9-6.8 4.4-12.6 1.5-34.1-17.1-56.4-30.4-78.9-68.9-6-10.2 6-9.5 17-31.7 1.9-3.9 1-7.3-.5-10.2-1.5-2.9-13.1-31.5-17.9-43-4.7-11.3-9.5-9.7-13.1-9.9-3.4-.2-7.3-.2-11.1-.2s-10.1 1.5-15.5 7.3c-5.3 5.8-20.3 19.8-20.3 48.4s20.8 56.2 23.7 60c2.9 3.9 40.9 62.4 99.1 87.5 36.8 15.9 51.2 17.2 69.6 14.5 11.2-1.7 34.2-14 39.1-27.6 4.9-13.6 4.9-25.2 3.4-27.6-1.5-2.4-5.3-3.9-11-6.8z" />
        </svg>
      </a>
    </Router>
  );
}
