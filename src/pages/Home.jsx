import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import * as Lucide from 'lucide-react';
import { projectsData } from '../data/projectsData.js';
import { blogsData } from '../data/blogsData.js';
import PageTransition from '../components/PageTransition.jsx';
import RevealText from '../components/RevealText.jsx';
import Footer from '../components/Footer.jsx';

gsap.registerPlugin(ScrollTrigger);

const heroSlides = [
  {
    title: 'Flora 11',
    location: 'Morbi',
    img: '/Flora 11/F11 LV ELE 01.webp'
  },
  {
    title: 'Golden Heights',
    location: 'Morbi',
    img: '/Golden Heights/GH MB ELE 1.webp'
  },
  {
    title: 'Silver Heights',
    location: 'Morbi',
    img: '/Silver Heights/FL LV ELE 1.webp'
  },
  {
    title: 'Office Design',
    location: 'Morbi',
    img: '/Office Design/N.OFFICE ELE 01.webp'
  },
  {
    title: 'Sthapatya',
    location: 'Morbi',
    img: '/Sthapatya/ELEVATION 1.webp'
  },
  {
    title: 'Twin Tower',
    location: 'Morbi',
    img: '/Twin Tower/L1.webp'
  }
];

const serviceImages = [
  '/Silver Heights/FL LV ELE 1.webp',     // Interior Design
  '/Flora 11/F11 LV ELE 01.webp',         // 3D Interior Visualization
  '/Sthapatya/ELEVATION 1.webp',          // Architectural Visualization
  '/Golden Heights/GH MB ELE 1.webp',      // 3D Floor Plans
  '/Twin Tower/L1.webp'                   // Animation Walkthroughs
];

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const onChange = (e) => setIsDesktop(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const target = location.state.scrollTo;
      window.history.replaceState({}, document.title);

      const timer = setTimeout(() => {
        if (window.lenis) {
          window.lenis.scrollTo(target, { duration: 1.5 });
        } else {
          document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [location]);

  // Form State
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('idle');

  // Hero Slider State
  const [heroIdx, setHeroIdx] = useState(0);
  const heroTimerRef = useRef(null);

  const resetHeroTimer = () => {
    if (heroTimerRef.current) clearInterval(heroTimerRef.current);
    heroTimerRef.current = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % heroSlides.length);
    }, 5500); // 5.5s autoplay interval
  };

  useEffect(() => {
    resetHeroTimer();
    return () => {
      if (heroTimerRef.current) clearInterval(heroTimerRef.current);
    };
  }, []);

  // Services Hover Preview State
  const [hoveredSvcIdx, setHoveredSvcIdx] = useState(null);

  // Framer Motion Spring mouse tracker for Services Floating Preview
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 280, mass: 0.6 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);



  // ── Form Submission ──
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) return;

    setFormStatus('sending');
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setFormStatus('success');

    setTimeout(() => {
      setFormState({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
      setFormStatus('idle');
    }, 4000);
  };

  // Helper to scroll to section
  const scrollToSection = (e, targetId) => {
    e.preventDefault();
    if (window.lenis) {
      window.lenis.scrollTo(targetId);
    } else {
      document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ── GSAP ScrollTrigger Animations (Parallax & Pinning) ──
  useGSAP(() => {
    // 1. Hero Scroll Parallax
    const heroImg = document.querySelector('.hero-img');
    if (heroImg) {
      gsap.to(heroImg, {
        y: 80,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    }

    const heroLeft = document.querySelector('.hero-left');
    if (heroLeft) {
      gsap.to(heroLeft, {
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    }

    // 2. Parallax Section Transitions
    document.querySelectorAll('.section').forEach((section) => {
      const inner = section.querySelector('.container') || section;
      gsap.fromTo(inner,
        { y: 40 },
        {
          y: 0, ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'top 40%',
            scrub: true,
          }
        }
      );
    });

    // 3. Stat Counter Animation
    const counterElements = document.querySelectorAll('.count-n[data-target]');
    counterElements.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const target = +el.dataset.target;
          const duration = 1800;
          const t0 = performance.now();
          const tick = (now) => {
            const p = Math.min((now - t0) / duration, 1);
            el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target;
          };
          requestAnimationFrame(tick);
        }
      });
    });

    // 4. Horizontal scroll section pinning
    const pin = document.getElementById('hPin');
    const track = document.getElementById('hTrack');
    if (pin && track) {
      const mm = gsap.matchMedia(containerRef);

      mm.add("(min-width: 768px)", () => {
        const getScrollAmount = () => {
          return track.scrollWidth - window.innerWidth;
        };

        const hScrollTween = gsap.to(track, {
          x: () => -getScrollAmount(),
          ease: 'none',
        });

        ScrollTrigger.create({
          trigger: pin,
          pin: true,
          animation: hScrollTween,
          scrub: true, // Direct synchronization with smooth scroll (Lenis) to eliminate jerks
          end: () => '+=' + getScrollAmount(),
          invalidateOnRefresh: true,
        });
      });

      mm.add("(max-width: 767px)", () => {
        // Reset any transforms so native CSS overflow-x takes over
        gsap.set(track, { clearProps: "transform" });
      });

      ScrollTrigger.refresh();
    }
  }, { scope: containerRef });

  return (
    <PageTransition>
      <div ref={containerRef}>
        <Helmet>
          <title>Craft Design Studio | Interior Design, 3D Visualization & Turnkey Projects in Morbi</title>
          <meta name="description" content="Premium interior design, 3D visualization, turnkey projects, architectural rendering, and walkthrough studio in Morbi & Rajkot, Gujarat. Craft Design Studio." />
          <link rel="canonical" href="https://craftdesignstudio.in/" />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "Craft Design Studio",
              "alternateName": "Craft Design Studio",
              "description": "Premium interior design, 3D visualization, turnkey projects, architectural rendering, and walkthrough animation studio in Morbi & Rajkot, Gujarat.",
              "image": "https://craftdesignstudio.in/Logo.png",
              "@id": "https://craftdesignstudio.in/#organization",
              "url": "https://craftdesignstudio.in/",
              "telephone": "+91-87583-95671, +91-83206-95380",
              "priceRange": "$$$",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "28"
              },
              "address": [
                {
                  "@type": "PostalAddress",
                  "streetAddress": "1st Floor, Shreeji Arcade, Opposite VI Store, Sanala Road",
                  "addressLocality": "Morbi",
                  "addressRegion": "Gujarat",
                  "postalCode": "363641",
                  "addressCountry": "IN"
                },
                {
                  "@type": "PostalAddress",
                  "streetAddress": "Kataria Chowkdi, Near Housing",
                  "addressLocality": "Rajkot",
                  "addressRegion": "Gujarat",
                  "postalCode": "360001",
                  "addressCountry": "IN"
                }
              ],
              "sameAs": [
                "https://instagram.com/craft_design_studio1"
              ]
            })}
          </script>
        </Helmet>

        {/* Skip link */}
        <a href="#main-content-section" className="skip-link" onClick={(e) => scrollToSection(e, '#main-content-section')}>
          Skip to main content
        </a>

        {/* HERO */}
        <section className="hero" id="home" aria-label="Hero – Designing Interiors, Defining Elegance">
          <div className="hero-left">
            <p className="hero-eyebrow">
              <span className="eyebrow-inner" style={{ transform: 'none', opacity: 1 }}>
                Interior Design &amp; Visualization Studio
              </span>
            </p>
            <h1 className="hero-title" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <RevealText text="Designing Interiors," delay={0.1} />
              <RevealText text="Defining Elegance." className="yellow-t" delay={0.3} />
            </h1>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="hero-actions"
            >
              <a href="#projects" onClick={(e) => scrollToSection(e, '#projects')} className="btn-dark" id="heroBtn1">
                <span>View Our Work</span>
                <Lucide.ArrowRight className="icon-xs" aria-hidden="true" />
              </a>
              <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')} className="btn-ghost" id="heroBtn2">
                Start a Project
              </a>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="hero-location"
            >
              <Lucide.MapPin className="icon-xs" aria-hidden="true" />
              <span>Morbi &amp; Rajkot, Gujarat</span>
            </motion.p>
          </div>
          <div className="hero-right">
            <motion.div 
              initial={{ clipPath: 'inset(0 0 100% 0)' }}
              animate={{ clipPath: 'inset(0 0 0% 0)' }}
              transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
              className="hero-img-frame" 
              id="heroFrame"
            >
              <div className="hero-img" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                {heroSlides.map((slide, idx) => (
                  <motion.img
                    key={slide.img}
                    src={slide.img}
                    alt={`${slide.title} — ${slide.location} visualization`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: idx === heroIdx ? 1 : 0 }}
                    transition={{ duration: 0.9, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      pointerEvents: idx === heroIdx ? 'auto' : 'none',
                    }}
                  />
                ))}
              </div>
              
              <div className="hero-img-badge" aria-hidden="true" style={{ overflow: 'hidden' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={heroIdx}
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
                  >
                    <span>{heroSlides[heroIdx].title}</span>
                    <span>·</span>
                    <span>{heroSlides[heroIdx].location}</span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slider indicators */}
              <div className="hero-slider-nav" aria-label="Hero slider controls">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setHeroIdx(idx);
                      resetHeroTimer();
                    }}
                    className={`hero-dot ${idx === heroIdx ? 'active' : ''}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="hero-float-tag" 
              id="heroTag" 
              aria-hidden="true"
            >
              <Lucide.Award className="icon-xs" aria-hidden="true" />
              <span>Premium Quality Visualization</span>
            </motion.div>
          </div>
          <div className="hero-bottom" aria-label="Studio statistics">
            <div className="hero-stat">
              <h3><span className="count-n" data-target="50">0</span><em>+</em></h3>
              <p>Projects Delivered</p>
            </div>
            <div className="hero-sep" aria-hidden="true"></div>
            <div className="hero-stat">
              <h3><span className="count-n" data-target="100">0</span><em>%</em></h3>
              <p>Client Satisfaction</p>
            </div>
            <div className="hero-sep" aria-hidden="true"></div>
            <div className="hero-stat">
              <h3>2</h3>
              <p>Studio Locations</p>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div id="main-content-section" className="marquee-strip" aria-hidden="true">
          <div className="marquee-wrap">
            <div className="marquee-track">
              <span>Designing Interiors</span><span className="mdot">·</span>
              <span>Defining Elegance</span><span className="mdot">·</span>
              <span>3D Visualization</span><span className="mdot">·</span>
              <span>Architectural Excellence</span><span className="mdot">·</span>
              <span>Interior Design</span><span className="mdot">·</span>
              <span>Animation Walkthroughs</span><span className="mdot">·</span>
            </div>
            <div className="marquee-track" aria-hidden="true">
              <span>Designing Interiors</span><span className="mdot">·</span>
              <span>Defining Elegance</span><span className="mdot">·</span>
              <span>3D Visualization</span><span className="mdot">·</span>
              <span>Architectural Excellence</span><span className="mdot">·</span>
              <span>Interior Design</span><span className="mdot">·</span>
              <span>Animation Walkthroughs</span><span className="mdot">·</span>
            </div>
          </div>
        </div>

        {/* ABOUT */}
        <section className="about section" id="about" aria-label="About the Studio">
          <div className="container">
            <div className="about-grid">
              <div className="about-visuals">
                <motion.div 
                  initial={{ clipPath: 'inset(0 0 100% 0)' }}
                  whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 1.4, ease: [0.19, 1, 0.22, 1] }}
                  className="ab-img ab-img-1"
                >
                  <img src="/Sthapatya/ELEVATION 1.webp" alt="Sthapatya residential elevation design with modern architecture by Craft Design Studio" loading="lazy" width="800" height="1000" />
                </motion.div>
                <motion.div 
                  initial={{ clipPath: 'inset(0 0 100% 0)' }}
                  whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 1.4, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
                  className="ab-img ab-img-2"
                >
                  <img src="/Twin Tower/L1.webp" alt="Twin Tower luxury living room visualization with contemporary interiors" loading="lazy" width="600" height="400" />
                </motion.div>
                <div className="ab-accent-box" aria-hidden="true">
                  <span className="ab-year">Est.</span>
                  <span className="ab-yr-num">2023</span>
                </div>
              </div>
              <div className="about-copy">
                <p className="label">About the Studio</p>
                <h2 className="section-title" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <RevealText text="We Are" delay={0.1} />
                  <RevealText text="Craft." className="yellow-t" delay={0.2} />
                </h2>
                <motion.blockquote 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="about-quote"
                >
                  "Designing Interiors, Defining Elegance."
                </motion.blockquote>
                <motion.p 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="body-t"
                >
                  Craft The Design Studio is a boutique creative studio founded by two passionate designers who believe great design is the intersection of art, technology, and human experience.
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="body-t"
                >
                  We specialize in interior design and high-quality 3D visualization — helping clients see their vision come to life through stunning photorealistic renders, cinematic walkthroughs, and thoughtful spatial design.
                </motion.p>
                <div className="founders">
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-5%' }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="founder-card"
                  >
                    <div className="f-av">
                      <img src="/vhzala.webp" alt="Vishvarajsinh Zala — Co-Founder of Craft Design Studio" loading="lazy" width="72" height="72" />
                    </div>
                    <div className="f-info">
                      <h4>Vishvarajsinh Zala</h4>
                      <span>Co-Founder &amp; Design Director</span>
                      <a href="tel:+918758395671" className="f-phone" aria-label="Call Vishvarajsinh Zala at +91 87583 95671">
                        <Lucide.Phone className="icon-xs" aria-hidden="true" />+91 87583 95671
                      </a>
                    </div>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-5%' }}
                    transition={{ duration: 0.8, delay: 0.35 }}
                    className="founder-card"
                  >
                    <div className="f-av">
                      <img src="/yash.webp" alt="Yash Gharvaliya — Co-Founder of Craft Design Studio" loading="lazy" width="72" height="72" />
                    </div>
                    <div className="f-info">
                      <h4>Yash Gharvaliya</h4>
                      <span>Co-Founder &amp; Visualization Lead</span>
                      <a href="tel:+918320695380" className="f-phone" aria-label="Call Yash Gharvaliya at +91 83206 95380">
                        <Lucide.Phone className="icon-xs" aria-hidden="true" />+91 83206 95380
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="services section section-cream" id="services" aria-label="Our Services">
          <div className="container">
            <div className="services-head">
              <div>
                <p className="label">What We Do</p>
                <h2 className="section-title">
                  <RevealText text="Our Services" delay={0.1} />
                </h2>
              </div>
              <p className="svc-sub">Precision craftsmanship across every dimension of space and visual design.</p>
            </div>
            <div className="svc-list" role="list">
              {[
                {
                  idx: 0,
                  num: '01',
                  icon: <Lucide.Home aria-hidden="true" />,
                  title: 'Interior Design',
                  text: 'Aesthetically refined and functional spaces tailored to your lifestyle, business goals, and spatial requirements.',
                  tags: ['Space planning', 'Furniture layout', 'Material selection', 'Color palette design', 'Lighting concepts', 'Mood boards']
                },
                {
                  idx: 1,
                  num: '02',
                  icon: <Lucide.Monitor aria-hidden="true" />,
                  title: '3D Interior Visualization',
                  text: 'High-quality photorealistic interior renders that help clients visualize the final outcome before execution begins.',
                  tags: ['Living room renders', 'Bedroom renders', 'Kitchen visualization', 'Office interiors', 'Hospitality spaces', 'Luxury apartments']
                },
                {
                  idx: 2,
                  num: '03',
                  icon: <Lucide.Building2 aria-hidden="true" />,
                  title: 'Architectural Visualization',
                  text: 'Exterior architectural rendering services for residential, commercial, and mixed-use projects.',
                  tags: ['Exterior renders', 'Daylight renders', 'Night renders', 'Landscape visualization', 'Architectural detailing']
                },
                {
                  idx: 3,
                  num: '04',
                  icon: <Lucide.Layout aria-hidden="true" />,
                  title: '3D Floor Plans',
                  text: 'Interactive and visually engaging floor plan presentations for developers, architects, and real estate marketing.',
                  tags: ['Photorealistic plans', 'Developer packages', 'Real estate marketing', 'Architectural documentation']
                },
                {
                  idx: 4,
                  num: '05',
                  icon: <Lucide.Film aria-hidden="true" />,
                  title: 'Animation Walkthroughs',
                  text: 'Cinematic walkthrough animations that let clients experience their project through motion and storytelling.',
                  tags: ['Interior walkthroughs', 'Exterior flythroughs', 'Real estate videos', 'Camera animation', 'Cinematic lighting']
                }
              ].map((svc, i) => (
                <motion.article 
                  key={svc.num} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-5%' }}
                  transition={{ duration: 0.8, delay: i * 0.08 }}
                  className="svc-row" 
                  role="listitem"
                  onMouseEnter={() => setHoveredSvcIdx(svc.idx)}
                  onMouseLeave={() => setHoveredSvcIdx(null)}
                >
                  <div className="svc-left">
                    <span className="svc-n" aria-hidden="true">{svc.num}</span>
                    <div className="svc-icon-wrap" aria-hidden="true">{svc.icon}</div>
                  </div>
                  <div className="svc-mid">
                    <h3>{svc.title}</h3>
                    <p>{svc.text}</p>
                  </div>
                  <ul className="svc-tags" aria-label={`${svc.title} service features`}>
                    {svc.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>
          </div>
          
          {/* Awwwards-style mouse following image preview follower */}
          {isDesktop && (
            <motion.div
              style={{
                position: 'fixed',
                left: smoothMouseX,
                top: smoothMouseY,
                pointerEvents: 'none',
                zIndex: 10,
                x: '-50%',
                y: '-50%',
              }}
            >
              <AnimatePresence>
                {hoveredSvcIdx !== null && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0, rotate: -5 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0, rotate: 5 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      width: '280px',
                      height: '180px',
                      overflow: 'hidden',
                      borderRadius: '4px',
                      boxShadow: '0 24px 60px rgba(20,18,16,0.3)',
                      border: '1.5px solid #E8B84B',
                      background: '#141210'
                    }}
                  >
                    <img 
                      src={serviceImages[hoveredSvcIdx]} 
                      alt="Service category visualization preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </section>

        {/* FEATURED PROJECTS — HORIZONTAL SCROLL WITH PINNED HEADING */}
        <section className="featured" id="projects" aria-label="Featured Projects">
          <div className="h-pin" id="hPin">
            <div className="featured-hd-wrapper">
              <div className="featured-hd">
                <div>
                  <p className="label">Our Portfolio</p>
                  <h2 className="section-title">
                    <RevealText text="Featured" delay={0.1} />
                    <RevealText text="Projects" className="yellow-t" delay={0.2} />
                  </h2>
                </div>
                <p className="scroll-cue">
                  <Lucide.MoveRight className="icon-sm" aria-hidden="true" />&nbsp;Scroll to explore
                </p>
              </div>
            </div>
            
            <div className="h-track-container" style={{ overflow: 'visible', width: '100%' }}>
              <div className="h-track" id="hTrack" role="list" aria-label="Project gallery">
                {projectsData.map((proj, idx) => (
                  <Link
                    key={proj.id}
                    className="proj-card"
                    to={`/project/${proj.id}`}
                    role="listitem"
                    aria-label={`${proj.title} — ${proj.tag} project`}
                  >
                    <div className="proj-img">
                      <img src={proj.thumbnail} alt={`${proj.title} thumbnail`} loading="lazy" width="440" height="480" />
                      <div className="proj-img-overlay" aria-hidden="true"></div>
                    </div>
                    <div className="proj-meta">
                      <span className="proj-num" aria-hidden="true">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="proj-text">
                        <h3>{proj.title}</h3>
                        <p>{proj.tag}</p>
                      </div>
                      <div className="proj-arrow-wrap" aria-hidden="true">
                        <Lucide.ArrowUpRight aria-hidden="true" />
                      </div>
                    </div>
                  </Link>
                ))}
                {/* Right spacer to keep the last card from touching the right edge of the screen */}
                <div className="h-track-spacer" style={{ width: 'var(--pad-h)', flexShrink: 0 }} aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="process section" id="process" aria-label="Our Design Process">
          <div className="container">
            <div className="process-hd">
              <p className="label">How We Work</p>
              <h2 className="section-title">
                <RevealText text="Our Process" delay={0.1} />
              </h2>
            </div>
            <div className="process-list" role="list">
              {[
                {
                  num: '01',
                  title: 'Discovery & Brief',
                  text: 'We begin with an in-depth conversation to understand your vision, spatial requirements, style preferences, and budget. Every great project starts with listening.'
                },
                {
                  num: '02',
                  title: 'Concept Development',
                  text: 'Our team crafts mood boards, space plans, and initial concept directions — exploring multiple ideas before refining the one that feels uniquely yours.'
                },
                {
                  num: '03',
                  title: 'Design & Visualization',
                  text: 'We build detailed 3D models and photorealistic renders, giving you a true-to-life preview of the final result before execution begins.'
                },
                {
                  num: '04',
                  title: 'Review & Refinement',
                  text: 'Your feedback shapes the final design. We iterate carefully until every material, light source, and proportion is exactly right.'
                },
                {
                  num: '05',
                  title: 'Final Delivery',
                  text: 'We deliver the complete package — renders, walkthroughs, floor plans, and all documentation — ready for execution and presentation.'
                }
              ].map((step, i) => (
                <motion.div 
                  key={step.num} 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-5%' }}
                  transition={{ duration: 0.8, delay: i * 0.08 }}
                  className="process-row" 
                  role="listitem"
                >
                  <span className="proc-n" aria-hidden="true">{step.num}</span>
                  <div className="proc-line" aria-hidden="true"></div>
                  <div className="proc-body">
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* LATEST INSIGHTS (SEO & Indexing Link Section) */}
        <section className="latest-insights section" id="insights" aria-label="Latest Design Insights">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px' }} className="insights-head">
              <div>
                <p className="label">Our Journal</p>
                <h2 className="section-title">
                  <RevealText text="Latest Insights" delay={0.1} />
                </h2>
              </div>
              <Link to="/blog" className="btn-dark" style={{ padding: '12px 24px', fontSize: '10px' }}>
                <span>Read All Insights</span>
                <Lucide.ArrowRight className="icon-xs" />
              </Link>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }} className="insights-grid">
              {blogsData.slice(0, 3).map((blog, idx) => (
                <motion.article 
                  key={blog.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  style={{ 
                    background: 'var(--bg-cream)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '2px', 
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  className="blog-card"
                >
                  <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/10' }}>
                    <Link to={`/blog/${blog.slug}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                      <img 
                        src={blog.banner} 
                        alt={blog.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        className="zoom-hover-img"
                      />
                    </Link>
                    <span style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      fontSize: '8px',
                      fontFamily: 'var(--ff-mono)',
                      padding: '4px 10px',
                      background: 'rgba(20,18,16,0.85)',
                      backdropFilter: 'blur(8px)',
                      color: '#fff',
                      borderRadius: '20px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      fontWeight: 500
                    }}>
                      {blog.category}
                    </span>
                  </div>
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <div style={{ display: 'flex', gap: '10px', fontFamily: 'var(--ff-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      <span>{blog.date}</span>
                      <span>·</span>
                      <span>{blog.readTime}</span>
                    </div>
                    <h4 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--dark)', marginBottom: '12px', lineHeight: 1.3 }}>
                      <Link to={`/blog/${blog.slug}`} style={{ transition: 'color 0.3s' }} className="blog-title-link">
                        {blog.title}
                      </Link>
                    </h4>
                    <p className="body-t" style={{ fontSize: '0.88rem', marginBottom: '20px', flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {blog.excerpt}
                    </p>
                    <Link to={`/blog/${blog.slug}`} className="btn-ghost" style={{ marginTop: 'auto', padding: '8px 16px', fontSize: '10px', justifyContent: 'center', borderWidth: '1px' }}>
                      <span>Read Insight</span>
                      <Lucide.ArrowUpRight className="icon-xs" style={{ width: '12px', height: '12px' }} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="contact section section-cream" id="contact" aria-label="Contact Us">
          <div className="container">
            <div className="contact-grid">
              <div className="contact-left">
                <p className="label">Get In Touch</p>
                <h2 className="section-title" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <RevealText text="Let's Build" delay={0.1} />
                  <RevealText text="Something" delay={0.2} />
                  <RevealText text="Beautiful." className="yellow-t" delay={0.3} />
                </h2>
                <p className="body-t">Have a project in mind? Tell us your vision and we'll craft something extraordinary together.</p>

                <div className="c-locations">
                  <address className="c-loc">
                    <div className="c-loc-icon" aria-hidden="true">
                      <Lucide.MapPin aria-hidden="true" />
                    </div>
                    <div>
                      <h4>Morbi Studio</h4>
                      <p>Craft Design Studio, 1st Floor, Shreeji Arcade,<br />Opposite VI Store, Sanala Road,<br />Morbi – 363641, Gujarat</p>
                    </div>
                  </address>
                  <address className="c-loc">
                    <div className="c-loc-icon" aria-hidden="true">
                      <Lucide.MapPin aria-hidden="true" />
                    </div>
                    <div>
                      <h4>Rajkot Studio</h4>
                      <p>Kataria Chowkdi, Near Housing,<br />Rajkot, Gujarat</p>
                    </div>
                  </address>
                </div>

                <div className="c-persons">
                  <div className="c-person">
                    <span>Vishvarajsinh Zala</span>
                    <a href="tel:+918758395671" aria-label="Call Vishvarajsinh Zala">
                      <Lucide.Phone className="icon-xs" aria-hidden="true" />+91 87583 95671
                    </a>
                  </div>
                  <div className="c-person">
                    <span>Yash Gharvaliya</span>
                    <a href="tel:+918320695380" aria-label="Call Yash Gharvaliya">
                      <Lucide.Phone className="icon-xs" aria-hidden="true" />+91 83206 95380
                    </a>
                  </div>
                </div>

                <a href="https://instagram.com/craft_design_studio1" target="_blank" rel="noopener noreferrer" className="ig-link" aria-label="Follow Craft Design Studio on Instagram">
                  <Lucide.Instagram aria-hidden="true" />
                  <span>@craft_design_studio1</span>
                </a>
              </div>

              <div className="contact-right">
                <form className="c-form" id="contactForm" onSubmit={handleFormSubmit} aria-label="Contact form">
                  <div className="form-row">
                    <div className="form-g">
                      <label htmlFor="fname">Name</label>
                      <input
                        type="text"
                        id="fname"
                        name="name"
                        placeholder="Your full name"
                        required
                        value={formState.name}
                        onChange={handleInputChange}
                        autoComplete="name"
                      />
                    </div>
                    <div className="form-g">
                      <label htmlFor="femail">Email</label>
                      <input
                        type="email"
                        id="femail"
                        name="email"
                        placeholder="your@email.com"
                        required
                        value={formState.email}
                        onChange={handleInputChange}
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className="form-g">
                    <label htmlFor="fphone">Phone</label>
                    <input
                      type="tel"
                      id="fphone"
                      name="phone"
                      placeholder="+91 00000 00000"
                      value={formState.phone}
                      onChange={handleInputChange}
                      autoComplete="tel"
                    />
                  </div>
                  <div className="form-g">
                    <label htmlFor="fservice">Service</label>
                    <select
                      id="fservice"
                      name="service"
                      value={formState.service}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a service...</option>
                      <option value="Interior Design">Interior Design</option>
                      <option value="3D Interior Visualization">3D Interior Visualization</option>
                      <option value="Architectural Visualization">Architectural Visualization</option>
                      <option value="3D Floor Plans">3D Floor Plans</option>
                      <option value="Animation Walkthroughs">Animation Walkthroughs</option>
                    </select>
                  </div>
                  <div className="form-g">
                    <label htmlFor="fmsg">Project Brief</label>
                    <textarea
                      id="fmsg"
                      name="message"
                      rows="5"
                      placeholder="Tell us about your project, timeline, and requirements..."
                      required
                      value={formState.message}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn-dark btn-form" id="submitBtn" disabled={formStatus !== 'idle'}>
                    <span>
                      {formStatus === 'idle' && 'Send Message'}
                      {formStatus === 'sending' && 'Sending…'}
                      {formStatus === 'success' && '✓ Sent!'}
                    </span>
                    {formStatus === 'idle' && <Lucide.Send className="icon-xs" aria-hidden="true" />}
                  </button>
                  <p
                    className="form-ok"
                    id="formOk"
                    role="alert"
                    style={{ display: formStatus === 'success' ? 'block' : 'none' }}
                  >
                    ✓ Message sent! We'll be in touch within 24 hours.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
        
        {/* Standard Full Footer */}
        <Footer />
      </div>
    </PageTransition>
  );
}
