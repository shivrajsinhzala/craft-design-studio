import React, { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import * as Lucide from 'lucide-react';
import { projectsData } from '../data/projectsData.js';
import Lightbox from '../components/Lightbox.jsx';
import Footer from '../components/Footer.jsx';
import PageTransition from '../components/PageTransition.jsx';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Find current, next, and previous projects
  const projectIndex = projectsData.findIndex((p) => p.id === id);
  const project = projectsData[projectIndex];

  const prevProject =
    projectIndex > -1
      ? projectsData[projectIndex === 0 ? projectsData.length - 1 : projectIndex - 1]
      : null;
  const nextProject =
    projectIndex > -1
      ? projectsData[projectIndex === projectsData.length - 1 ? 0 : projectIndex + 1]
      : null;

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  if (!project) {
    return (
      <div className="container" style={{ padding: '200px 80px', textAlign: 'center' }}>
        <h2 className="section-title">Project Not Found</h2>
        <p className="body-t" style={{ marginTop: '20px' }}>
          The project you are looking for does not exist.
        </p>
        <Link to="/" className="btn-dark" style={{ marginTop: '20px' }}>
          Back to Homepage
        </Link>
      </div>
    );
  }

  // Handle keyboard interaction for opening lightbox
  const handleKeyDownImage = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setLightboxIndex(index);
    }
  };

  return (
    <PageTransition>
      <div ref={containerRef}>
        <Helmet>
          <title>{`${project.title} — ${project.tag} | Craft Design Studio`}</title>
          <meta name="description" content={project.description} />
          <link rel="canonical" href={`https://craftdesignstudio.in/project/${project.id}`} />
          
          {/* Open Graph */}
          <meta property="og:type" content="article" />
          <meta property="og:title" content={`${project.title} — ${project.tag} | Craft Design Studio`} />
          <meta property="og:description" content={project.description} />
          <meta property="og:url" content={`https://craftdesignstudio.in/project/${project.id}`} />
          <meta property="og:image" content={`https://craftdesignstudio.in${project.banner}`} />
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${project.title} | Craft Design Studio`} />
          <meta name="twitter:description" content={project.description} />
          <meta name="twitter:image" content={`https://craftdesignstudio.in${project.banner}`} />

          {/* JSON-LD Schema */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VisualArtwork",
              "name": project.title,
              "description": project.description,
              "image": `https://craftdesignstudio.in${project.banner}`,
              "creator": {
                "@type": "Organization",
                "name": "Craft Design Studio"
              },
              "artMedium": "3D Render",
              "artform": "Architecture & Interior Visualization"
            })}
          </script>
        </Helmet>

        {/* Skip to gallery */}
        <a
          href="#gallery"
          className="skip-link"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Skip to gallery
        </a>

        {/* PROJECT HERO */}
        <div className="proj-hero">
          <div className="proj-hero-bg">
            <motion.img 
              initial={{ scale: 1.12 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              src={project.banner} 
              alt={`${project.title} hero banner`} 
              fetchPriority="high" 
            />
          </div>
          <div className="proj-hero-overlay" aria-hidden="true"></div>
          <div className="proj-hero-content">
            <motion.p 
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="proj-hero-tag"
            >
              {project.tag}
            </motion.p>
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.3 }}
              className="proj-hero-title"
            >
              {project.title}
            </motion.h1>
            <motion.p 
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="proj-hero-meta"
            >
              {project.meta}
            </motion.p>
          </div>
        </div>

        {/* BREADCRUMB */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="proj-breadcrumb" 
          aria-label="Breadcrumb"
        >
          <Link to="/">Home</Link>
          <Lucide.ChevronRight aria-hidden="true" />
          <a
            href="/#projects"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
              setTimeout(() => window.lenis?.scrollTo('#projects'), 150);
            }}
          >
            Projects
          </a>
          <Lucide.ChevronRight aria-hidden="true" />
          <span aria-current="page">{project.title}</span>
        </motion.nav>

        {/* GALLERY */}
        <section className="proj-gallery" id="gallery" aria-label={`${project.title} project gallery`}>
          <div className="gallery-grid">
            {project.images.map((img, index) => (
              <motion.img
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className={img.fullW ? 'full-w' : ''}
                src={img.src}
                alt={img.alt}
                loading="lazy"
                onClick={() => setLightboxIndex(index)}
                onKeyDown={(e) => handleKeyDownImage(e, index)}
                tabIndex={0}
                role="button"
                aria-label={`Open lightbox view for: ${img.alt}`}
              />
            ))}
          </div>
        </section>

        {/* PROJECT NAVIGATION */}
        {prevProject && nextProject && (
          <motion.nav 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="proj-nav-bar" 
            aria-label="Project navigation"
          >
            <div className="proj-nav-prev">
              <Link to={`/project/${prevProject.id}`} className="proj-nav-link">
                <Lucide.ArrowLeft aria-hidden="true" /> {prevProject.title}
              </Link>
            </div>
            <div className="proj-nav-center">
              <a
                href="/#projects"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                  setTimeout(() => window.lenis?.scrollTo('#projects'), 150);
                }}
                className="proj-nav-all"
              >
                All Projects
              </a>
            </div>
            <div className="proj-nav-next">
              <Link to={`/project/${nextProject.id}`} className="proj-nav-link">
                {nextProject.title} <Lucide.ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </motion.nav>
        )}

        {/* Simple Copyright Footer */}
        <Footer simple={true} />

        {/* Accessible Lightbox Modal */}
        <Lightbox
          isOpen={lightboxIndex > -1}
          images={project.images}
          activeIndex={lightboxIndex}
          onPrev={() => setLightboxIndex((prev) => (prev === 0 ? project.images.length - 1 : prev - 1))}
          onNext={() => setLightboxIndex((prev) => (prev === project.images.length - 1 ? 0 : prev + 1))}
          onClose={() => setLightboxIndex(-1)}
        />
      </div>
    </PageTransition>
  );
}
