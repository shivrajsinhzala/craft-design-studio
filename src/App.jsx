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
          viewBox="0 0 24 24"
          fill="currentColor"
          className="whatsapp-icon"
          aria-hidden="true"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.498 1.45 5.41 1.451 5.428 0 9.847-4.385 9.85-9.773.001-2.61-1.013-5.064-2.859-6.912C17.152 2.07 14.7 1.055 12.092 1.055c-5.434 0-9.852 4.387-9.855 9.776-.001 1.905.495 3.766 1.437 5.372L2.553 20.25l4.094-1.096zM17.65 14.88c-.307-.154-1.82-.9-2.1-.1-.28.1-.482.72-.59.84-.108.12-.217.13-.524-.02-.307-.154-1.295-.477-2.467-1.523-.912-.814-1.528-1.82-1.708-2.126-.18-.307-.02-.472.134-.626.138-.138.307-.36.46-.538.154-.18.205-.307.307-.513.102-.206.05-.385-.026-.538-.077-.154-.69-1.667-.945-2.282-.248-.598-.5-.517-.69-.527l-.59-.01c-.205 0-.538.077-.82.385-.282.307-1.077 1.05-1.077 2.564 0 1.513 1.1 2.974 1.254 3.18 1.54 2.03 2.936 2.986 5.097 3.82.512.2.912.32 1.22.42.514.16.98.14 1.348.08.41-.066 1.82-.743 2.077-1.46.256-.718.256-1.333.18-1.46-.077-.127-.282-.205-.59-.36z" />
        </svg>
      </a>
    </Router>
  );
}
