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
        <title>Craft – The Design Studio | Designing Interiors, Defining Elegance</title>
        <meta name="description" content="Premium interior design, 3D visualization, architectural rendering, and animation walkthrough studio based in Morbi & Rajkot, Gujarat. Designing Interiors, Defining Elegance." />
        <link rel="canonical" href="https://craftdesignstudio.in/" />
        <meta property="og:image" content="https://craftdesignstudio.in/og-image.png" />
        <meta name="twitter:image" content="https://craftdesignstudio.in/og-image.png" />
      </Helmet>
      <ScrollToTop />
      <Cursor />
      <Navbar />
      <main id="main-content">
        <AnimatedRoutes />
      </main>
    </Router>
  );
}
