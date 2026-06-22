import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import * as Lucide from 'lucide-react';
import { blogsData } from '../data/blogsData.js';
import PageTransition from '../components/PageTransition.jsx';
import Footer from '../components/Footer.jsx';

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const blog = blogsData.find((b) => b.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }
  }, [slug]);

  if (!blog) {
    return (
      <div className="container" style={{ padding: '200px var(--pad-h)', textAlign: 'center' }}>
        <h2 className="section-title">Article Not Found</h2>
        <p className="body-t" style={{ marginTop: '20px' }}>
          The article you are looking for does not exist.
        </p>
        <Link to="/blog" className="btn-dark" style={{ marginTop: '20px' }}>
          Back to Insights
        </Link>
      </div>
    );
  }

  // Find next/prev articles
  const blogIndex = blogsData.findIndex((b) => b.slug === slug);
  const prevBlog = blogIndex > 0 ? blogsData[blogIndex - 1] : null;
  const nextBlog = blogIndex < blogsData.length - 1 ? blogsData[blogIndex + 1] : null;

  return (
    <PageTransition>
      <div>
        <Helmet>
          <title>{`${blog.metaTitle || blog.title} | Craft Design Studio`}</title>
          <meta name="description" content={blog.metaDescription} />
          <link rel="canonical" href={`https://craftdesignstudio.in/blog/${blog.slug}`} />
          <meta property="og:type" content="article" />
          <meta property="og:title" content={`${blog.title} | Craft Design Studio`} />
          <meta property="og:description" content={blog.metaDescription} />
          <meta property="og:image" content={`https://craftdesignstudio.in${blog.banner}`} />
          <meta name="twitter:image" content={`https://craftdesignstudio.in${blog.banner}`} />
        </Helmet>

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
          <div className="proj-hero-content">
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
          <Link to="/">Home</Link>
          <Lucide.ChevronRight aria-hidden="true" />
          <Link to="/blog">Insights</Link>
          <Lucide.ChevronRight aria-hidden="true" />
          <span aria-current="page" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>{blog.title}</span>
        </motion.nav>

        {/* ARTICLE BODY */}
        <section className="container" style={{ padding: '60px var(--pad-h) 100px var(--pad-h)', display: 'flex', justifyContent: 'center' }}>
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
          >
            <div className="proj-nav-prev">
              {prevBlog ? (
                <Link to={`/blog/${prevBlog.slug}`} className="proj-nav-link">
                  <Lucide.ArrowLeft aria-hidden="true" /> {prevBlog.title}
                </Link>
              ) : (
                <span style={{ opacity: 0.3 }}>First Article</span>
              )}
            </div>
            <div className="proj-nav-center">
              <Link to="/blog" className="proj-nav-all">
                All Articles
              </Link>
            </div>
            <div className="proj-nav-next">
              {nextBlog ? (
                <Link to={`/blog/${nextBlog.slug}`} className="proj-nav-link">
                  {nextBlog.title} <Lucide.ArrowRight aria-hidden="true" />
                </Link>
              ) : (
                <span style={{ opacity: 0.3 }}>Latest Article</span>
              )}
            </div>
          </motion.nav>
        )}

        <Footer simple={true} />
      </div>
    </PageTransition>
  );
}
