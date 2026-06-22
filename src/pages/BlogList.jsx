import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import * as Lucide from 'lucide-react';
import { blogsData } from '../data/blogsData.js';
import PageTransition from '../components/PageTransition.jsx';
import Footer from '../components/Footer.jsx';

export default function BlogList() {
  return (
    <PageTransition>
      <div>
        <Helmet>
          <title>Design Journal & Insights | Craft The Design Studio Morbi & Rajkot</title>
          <meta name="description" content="Discover the latest interior design trends, 3D visualization insights, and space planning guides for Morbi, Rajkot, and Gujarat. Read articles by Craft The Design Studio." />
          <link rel="canonical" href="https://craftdesignstudio.in/blog" />
        </Helmet>

        {/* HEADER SPACE FOR SPACING */}
        <div style={{ height: '140px' }} />

        <section className="container" style={{ minHeight: '80vh', paddingBottom: '120px' }}>
          <div style={{ marginBottom: '60px' }}>
            <p className="label">Design Journal</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 300, lineHeight: 1.1 }}>
              Articles &amp; <span className="yellow-t">Insights</span>
            </h1>
            <p className="body-t" style={{ marginTop: '16px', maxWidth: '600px' }}>
              Explore our creative processes, modern material guides, and trends in interior design and 3D architectural rendering tailored for Morbi, Rajkot, and Saurashtra.
            </p>
          </div>

          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', 
              gap: '40px 28px' 
            }}
          >
            {blogsData.map((blog, idx) => (
              <motion.article 
                key={blog.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  background: 'var(--bg-cream)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  border: '1px solid var(--border)'
                }}
              >
                <Link to={`/blog/${blog.slug}`} style={{ display: 'block', overflow: 'hidden', aspectRatio: '16/10' }}>
                  <img 
                    src={blog.banner} 
                    alt={blog.title} 
                    loading="lazy" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      transition: 'transform 0.8s var(--ease-expo)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </Link>
                <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      fontFamily: 'var(--ff-mono)', 
                      fontSize: '10px', 
                      color: 'var(--muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '14px' 
                    }}
                  >
                    <span>{blog.date}</span>
                    <span>·</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <h3 
                    style={{ 
                      fontFamily: 'var(--ff-display)', 
                      fontSize: '1.6rem', 
                      fontWeight: 400, 
                      lineHeight: 1.25, 
                      color: 'var(--dark)', 
                      marginBottom: '12px' 
                    }}
                  >
                    <Link to={`/blog/${blog.slug}`} style={{ transition: 'color 0.3s' }} className="blog-title-link">
                      {blog.title}
                    </Link>
                  </h3>
                  <p className="body-t" style={{ fontSize: '0.92rem', marginBottom: '20px', flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {blog.excerpt}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                    {blog.tags.map(tag => (
                      <span 
                        key={tag} 
                        style={{ 
                          fontSize: '9px', 
                          fontFamily: 'var(--ff-mono)', 
                          padding: '4px 10px', 
                          background: 'rgba(20,18,16,0.05)',
                          borderRadius: '12px',
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
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
