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
          width="24"
          height="24"
          fill="currentColor"
          className="whatsapp-icon"
          aria-hidden="true"
        >
          <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.908.533 3.69 1.455 5.213L2.004 22l4.903-1.424A9.953 9.953 0 0 0 12.004 22c5.524 0 10-4.48 10-10.004S17.528 2 12.004 2zm3.805 13.99c-.23.655-1.127 1.207-1.782 1.282-.544.062-1.25.105-2.822-.52-2.01-.8-3.31-2.85-3.41-2.985-.1-.135-.805-1.072-.805-2.045 0-.973.51-1.45.69-1.63.18-.18.396-.225.528-.225.132 0 .264.004.378.01.118.005.277-.044.433.332.16.386.55 1.344.6 1.445.05.1.08.217.014.349-.066.132-.1.217-.2.333-.1.116-.2.26-.3.352-.1.1-.2.207-.087.4.113.193.5.824 1.077 1.34.743.66 1.37.865 1.564.962.194.098.307.083.423-.05.116-.133.5-.584.633-.784.133-.2.266-.166.449-.1.183.067 1.162.548 1.36.648.2.1.332.15.38.233.048.083.048.48-.182 1.135z" />
        </svg>
      </a>
    </Router>
  );
}
