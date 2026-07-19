import React, { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import * as Lucide from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';
import Footer from '../components/Footer.jsx';

export default function BlogDetail({ blog, prevBlog, nextBlog, relatedBlogs }) {

  // Scroll Progress Bar Tracker
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }
  }, [blog]);

  if (!blog) {
    return (
      <div className="container" style={{ padding: '200px var(--pad-h)', textAlign: 'center' }}>
        <h2 className="section-title">Article Not Found</h2>
        <p className="body-t" style={{ marginTop: '20px' }}>
          The article you are looking for does not exist.
        </p>
        <a href="/blog" className="btn-dark" style={{ marginTop: '20px' }}>
          Back to Insights
        </a>
      </div>
    );
  }

  return (
    <PageTransition>
      <div>
        {/* Scroll Progress Bar */}
        <motion.div 
          style={{ 
            scaleX, 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            height: '4px', 
            background: 'var(--yellow)', 
            transformOrigin: '0%', 
            zIndex: 9999 
          }} 
        />

        {/* HERO */}
        <div className="proj-hero" style={{ height: '70vh' }}>
          <div className="proj-hero-bg">
            <motion.img 
              initial={{ scale: 1.12 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              src={blog.banner} 
              alt={blog.title} 
              fetchPriority="high" 
            />
          </div>
          <div className="proj-hero-overlay" aria-hidden="true" style={{ opacity: 0.75 }}></div>
          <div className="blog-hero-content">
            <motion.div 
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', fontFamily: 'var(--ff-mono)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--yellow)', textTransform: 'uppercase' }}
            >
              <span>{blog.date}</span>
              <span>·</span>
              <span>{blog.readTime}</span>
            </motion.div>
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.3 }}
              className="proj-hero-title"
              style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', maxWidth: '900px', margin: '0 auto 16px auto', textShadow: '0 4px 24px rgba(20,18,16,0.3)' }}
            >
              {blog.title}
            </motion.h1>
            <motion.p 
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="proj-hero-meta"
            >
              By {blog.author}
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
          <a href="/">Home</a>
          <Lucide.ChevronRight aria-hidden="true" />
          <a href="/blog">Insights</a>
          <Lucide.ChevronRight aria-hidden="true" />
          <span aria-current="page" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>{blog.title}</span>
        </motion.nav>

        {/* ARTICLE BODY */}
        <section className="container" style={{ padding: '60px var(--pad-h) 80px var(--pad-h)', display: 'flex', justifyContent: 'center' }}>
          <article 
            className="blog-content-body"
            style={{ 
              maxWidth: '740px', 
              width: '100%',
              fontFamily: 'var(--ff-body)',
              fontSize: '1.02rem',
              lineHeight: '1.9',
              color: 'var(--muted)'
            }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </section>

        {/* NAVIGATION */}
        {(prevBlog || nextBlog) && (
          <motion.nav 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="proj-nav-bar" 
            aria-label="Article navigation"
            style={{ borderBottom: '1px solid var(--border)', paddingBottom: '40px', marginBottom: '0' }}
          >
            <div className="proj-nav-prev">
              {prevBlog ? (
                <a href={`/blog/${prevBlog.slug}`} className="proj-nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
                  <Lucide.ArrowLeft aria-hidden="true" style={{ flexShrink: 0 }} />
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '9px', opacity: 0.5, letterSpacing: '0.05em' }}>Previous Article</span>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--dark)', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', textTransform: 'none', letterSpacing: 'normal' }}>{prevBlog.title}</span>
                  </span>
                </a>
              ) : (
                <span style={{ opacity: 0.3, fontFamily: 'var(--ff-mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>First Article</span>
              )}
            </div>
            <div className="proj-nav-center">
              <a href="/blog" className="proj-nav-all">
                All Articles
              </a>
            </div>
            <div className="proj-nav-next">
              {nextBlog ? (
                <a href={`/blog/${nextBlog.slug}`} className="proj-nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textAlign: 'right', justifyContent: 'flex-end' }}>
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '9px', opacity: 0.5, letterSpacing: '0.05em' }}>Next Article</span>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--dark)', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', textTransform: 'none', letterSpacing: 'normal' }}>{nextBlog.title}</span>
                  </span>
                  <Lucide.ArrowRight aria-hidden="true" style={{ flexShrink: 0 }} />
                </a>
              ) : (
                <span style={{ opacity: 0.3, fontFamily: 'var(--ff-mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Latest Article</span>
              )}
            </div>
          </motion.nav>
        )}

        {/* RELATED ARTICLES */}
        {relatedBlogs.length > 0 && (
          <section className="related-blogs-sec" style={{ background: 'var(--bg-cream)', padding: '100px var(--pad-h)', borderTop: '1px solid var(--border)' }}>
            <div className="container" style={{ padding: 0 }}>
              <div className="related-blogs-header">
                <div>
                  <span className="label" style={{ marginBottom: '12px' }}>Read More</span>
                  <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 400, color: 'var(--dark)' }}>Related Insights</h2>
                </div>
                <a href="/blog" className="btn-dark" style={{ padding: '12px 24px', fontSize: '10px' }}>
                  <span>View All Articles</span>
                  <Lucide.ArrowRight className="icon-xs" style={{ width: '13px', height: '13px' }} />
                </a>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
                {relatedBlogs.map((rBlog) => (
                  <motion.article 
                    key={rBlog.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ 
                      background: 'var(--bg)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '2px', 
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    className="blog-card"
                  >
                    <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/10' }}>
                      <a href={`/blog/${rBlog.slug}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                        <img 
                          src={rBlog.banner} 
                          alt={rBlog.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          className="zoom-hover-img"
                        />
                      </a>
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
                        {rBlog.category}
                      </span>
                    </div>
                    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <div style={{ display: 'flex', gap: '10px', fontFamily: 'var(--ff-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        <span>{rBlog.date}</span>
                        <span>·</span>
                        <span>{rBlog.readTime}</span>
                      </div>
                      <h4 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--dark)', marginBottom: '14px', lineHeight: 1.3 }}>
                        <a href={`/blog/${rBlog.slug}`} style={{ transition: 'color 0.3s' }} className="blog-title-link">
                          {rBlog.title}
                        </a>
                      </h4>
                      <p className="body-t" style={{ fontSize: '0.9rem', marginBottom: '24px', flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {rBlog.excerpt}
                      </p>
                      <a href={`/blog/${rBlog.slug}`} className="btn-ghost" style={{ marginTop: 'auto', padding: '10px 20px', fontSize: '10px', justifyContent: 'center', borderWidth: '1px' }}>
                        <span>Read Insight</span>
                        <Lucide.ArrowUpRight className="icon-xs" style={{ width: '12px', height: '12px' }} />
                      </a>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        )}

        <Footer simple={true} />
      </div>
    </PageTransition>
  );
}
