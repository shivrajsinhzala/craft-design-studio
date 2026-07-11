import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import * as Lucide from 'lucide-react';
import { blogsData } from '../data/blogsData.js';
import PageTransition from '../components/PageTransition.jsx';
import Footer from '../components/Footer.jsx';

const CATEGORIES = ['All', 'Interior Design', '3D Rendering', 'Workspace'];

export default function BlogList() {
  const [activeCategory, setActiveCategory] = useState('All');

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    if (activeCategory === 'All') return blogsData;
    return blogsData.filter(blog => blog.category === activeCategory);
  }, [activeCategory]);

  // Featured blog (take the first one)
  const featuredBlog = useMemo(() => {
    return blogsData[0];
  }, []);

  // Grid blogs (excluding the featured one, unless filtering is active)
  const gridBlogs = useMemo(() => {
    if (activeCategory !== 'All') return filteredBlogs;
    return filteredBlogs.filter(blog => blog.slug !== featuredBlog.slug);
  }, [filteredBlogs, activeCategory, featuredBlog]);

  return (
    <PageTransition>
      <div className="blog-list-page">
        <Helmet>
          <title>Design Journal & Insights | Craft Design Studio</title>
          <meta name="description" content="Read our design journal featuring insights on interior design trends, 3D visualization, architectural rendering, and workspace planning in Morbi and Rajkot, Gujarat." />
          <link rel="canonical" href="https://craftdesignstudio.in/blog" />
        </Helmet>

        {/* HEADER SPACING */}
        <div style={{ height: '140px' }} />

        <main className="container" style={{ paddingBottom: '120px' }}>
          {/* HEADER SECTION */}
          <header style={{ marginBottom: '60px' }}>
            <p className="label">Design Journal</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(2.8rem, 6vw, 4.8rem)', fontWeight: 300, lineHeight: 1.1 }}>
              Articles &amp; <span className="yellow-t">Insights</span>
            </h1>
            <p className="body-t" style={{ marginTop: '16px', maxWidth: '600px', fontSize: '1.02rem', lineHeight: '1.8' }}>
              Bespoke visual guides, industry concepts, and spatial philosophies from Morbi &amp; Rajkot's premium design and visualization studio.
            </p>
          </header>

          {/* FEATURED POST SPOTLIGHT (Only shown on 'All' category filter) */}
          {activeCategory === 'All' && featuredBlog && (
            <section style={{ marginBottom: '80px' }}>
              <h2 className="label" style={{ marginBottom: '24px' }}>Featured Story</h2>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="feat-card"
              >
                <div className="feat-img-col">
                  <Link to={`/blog/${featuredBlog.slug}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                    <img
                      src={featuredBlog.banner}
                      alt={featuredBlog.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 1.2s var(--ease-expo)'
                      }}
                      className="zoom-hover-img"
                    />
                  </Link>
                </div>
                <div className="feat-content-col">
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <span 
                      style={{ 
                        fontSize: '9px', 
                        fontFamily: 'var(--ff-mono)', 
                        padding: '4px 10px', 
                        background: 'var(--yellow-lt)',
                        border: '1px solid var(--yellow)',
                        borderRadius: '2px',
                        color: 'var(--yellow)',
                        textTransform: 'uppercase',
                        fontWeight: 500
                      }}
                    >
                      {featuredBlog.category}
                    </span>
                  </div>
                  <h3 className="feat-title">
                    <Link to={`/blog/${featuredBlog.slug}`} style={{ transition: 'color 0.3s' }} className="blog-title-link">
                      {featuredBlog.title}
                    </Link>
                  </h3>
                  <p className="body-t" style={{ fontSize: '0.96rem', marginBottom: '28px', lineHeight: '1.8' }}>
                    {featuredBlog.excerpt}
                  </p>
                  <div className="feat-meta">
                    <span>By {featuredBlog.author}</span>
                    <span>·</span>
                    <span>{featuredBlog.date}</span>
                  </div>
                  <Link to={`/blog/${featuredBlog.slug}`} className="btn-dark" style={{ alignSelf: 'flex-start' }}>
                    <span>Read Feature</span>
                    <Lucide.ArrowRight className="icon-xs" />
                  </Link>
                </div>
              </motion.div>
            </section>
          )}

          {/* CATEGORY TABS */}
          <div className="category-tabs">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ARTICLES GRID */}
          <div style={{ position: 'relative', minHeight: '300px' }}>
            <AnimatePresence mode="popLayout">
              <motion.div
                layout
                key={activeCategory}
                className="blog-grid"
              >
                {gridBlogs.map((blog, idx) => (
                  <motion.article
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    key={blog.slug}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'var(--bg-cream)',
                      border: '1px solid var(--border)',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}
                    className="blog-card"
                  >
                    <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/10' }}>
                      <Link to={`/blog/${blog.slug}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                        <img
                          src={blog.banner}
                          alt={blog.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 1.0s var(--ease-expo)'
                          }}
                          className="zoom-hover-img"
                        />
                      </Link>
                      <span
                        style={{
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
                        }}
                      >
                        {blog.category}
                      </span>
                    </div>

                    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--ff-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
                        <span>{blog.date}</span>
                        <span>·</span>
                        <span>{blog.readTime}</span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.6rem', fontWeight: 400, lineHeight: 1.25, color: 'var(--dark)', marginBottom: '12px' }}>
                        <Link to={`/blog/${blog.slug}`} style={{ transition: 'color 0.3s' }} className="blog-title-link">
                          {blog.title}
                        </Link>
                      </h3>
                      <p className="body-t" style={{ fontSize: '0.92rem', marginBottom: '20px', flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {blog.excerpt}
                      </p>
                      
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '24px' }}>
                        {blog.tags.map(tag => (
                          <span
                            key={tag}
                            style={{
                              fontSize: '9px',
                              fontFamily: 'var(--ff-mono)',
                              padding: '3px 8px',
                              background: 'rgba(20,18,16,0.05)',
                              borderRadius: '2px',
                              color: 'var(--muted)'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Link
                        to={`/blog/${blog.slug}`}
                        className="btn-ghost"
                        style={{
                          marginTop: 'auto',
                          padding: '10px 20px',
                          fontSize: '10px',
                          justifyContent: 'center',
                          borderWidth: '1px'
                        }}
                      >
                        <span>Read Article</span>
                        <Lucide.ArrowUpRight className="icon-xs" />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
