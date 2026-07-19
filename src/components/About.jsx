import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import RevealText from './RevealText.jsx';

export default function About() {
  return (
    <main className="page-main">
      {/* Hero Section */}
      <section className="about-hero section" style={{ paddingTop: '180px', paddingBottom: '60px' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="label"
          >
            Our Story &amp; Vision
          </motion.div>
          
          <h1 className="section-title" style={{ maxWidth: '1000px', marginTop: '1rem', marginBottom: '2rem' }}>
            <RevealText text="We believe that" delay={0.1} />
            <RevealText text="great design" className="yellow-t" delay={0.2} />
            <RevealText text="begins with a deeper" delay={0.3} />
            <RevealText text="understanding of space." delay={0.4} />
          </h1>
        </div>
      </section>

      {/* Intro Section */}
      <section className="about-intro section" style={{ paddingTop: '40px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '80px', alignItems: 'start' }}>
          
          <div className="about-text-content">
            <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 3vw, 2.5rem)', marginBottom: '2rem' }}>
              The Foundation
            </h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="body-t" 
              style={{ fontSize: '1.1rem', marginBottom: '1.5rem', opacity: 0.9 }}
            >
              Craft The Design Studio was founded with a singular vision: to bridge the gap between imagination and reality. Based in the heart of Gujarat (Morbi and Rajkot), our studio has rapidly grown into a powerhouse of creativity, specializing in high-end interior design and photorealistic 3D architectural visualization.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="body-t" 
              style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}
            >
              With over 50+ successful projects delivered and 100% client satisfaction, our approach is rooted in meticulous attention to detail. Whether it's a sprawling commercial experience center or a cozy bespoke residential villa, we approach each space as a unique canvas.
            </motion.p>
          </div>

          <div className="about-image-grid" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ overflow: 'hidden', borderRadius: '16px' }}
            >
              <img 
                src="/Flora 11/F11 LV ELE 01.webp" 
                alt="Luxury interior design by Craft Design Studio" 
                style={{ width: '100%', objectFit: 'cover', aspectRatio: '4/3', transition: 'transform 0.5s' }}
                loading="eager" 
                fetchpriority="high"
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </motion.div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ overflow: 'hidden', borderRadius: '16px' }}
              >
                <img 
                  src="/Golden Heights/GH MB 2 ELE 3.webp" 
                  alt="Bedroom interior design" 
                  style={{ width: '100%', objectFit: 'cover', aspectRatio: '1/1', transition: 'transform 0.5s' }}
                  loading="lazy" 
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{ overflow: 'hidden', borderRadius: '16px' }}
              >
                <img 
                  src="/Silver Heights/FL LV ELE 6.webp" 
                  alt="Living room modern interior" 
                  style={{ width: '100%', objectFit: 'cover', aspectRatio: '1/1', transition: 'transform 0.5s' }}
                  loading="lazy" 
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="founders-section section" style={{ background: 'var(--bg-cream)', marginTop: '60px' }}>
        <div className="container">
          <div className="label">The Team</div>
          <h2 className="section-title" style={{ marginBottom: '4rem' }}>
            <RevealText text="Our Founders" delay={0.1} />
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
            
            {/* Founder 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ background: 'var(--bg)', padding: '40px', borderRadius: '2px', border: '1px solid var(--border-2)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 0.3s, transform 0.3s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--yellow)'; e.currentTarget.style.transform = 'translateY(-6px)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', marginBottom: '24px', border: '2px solid var(--yellow)', flexShrink: 0 }}>
                <img src="/vhzala.webp" alt="Vishvarajsinh Zala" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '32px', fontWeight: '400', color: 'var(--dark)' }}>Vishvarajsinh Zala</h3>
              <p style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--yellow)', marginTop: '8px', marginBottom: '24px' }}>Co-Founder &amp; Design Director</p>
              <p className="body-t" style={{ fontSize: '1.05rem' }}>Leading the creative vision, Vishvarajsinh brings years of expertise in spatial planning and interior aesthetics, ensuring every project balances form with flawless functionality.</p>
            </motion.div>

            {/* Founder 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ background: 'var(--bg)', padding: '40px', borderRadius: '2px', border: '1px solid var(--border-2)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 0.3s, transform 0.3s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--yellow)'; e.currentTarget.style.transform = 'translateY(-6px)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', marginBottom: '24px', border: '2px solid var(--yellow)', flexShrink: 0 }}>
                <img src="/yash.webp" alt="Yash Gharvaliya" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '32px', fontWeight: '400', color: 'var(--dark)' }}>Yash Gharvaliya</h3>
              <p style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--yellow)', marginTop: '8px', marginBottom: '24px' }}>Co-Founder &amp; Visualization Lead</p>
              <p className="body-t" style={{ fontSize: '1.05rem' }}>Mastering the art of photorealism, Yash transforms abstract blueprints into stunning 3D realities, helping clients walk through their dream spaces before a single brick is laid.</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ background: 'var(--dark)', color: 'var(--bg)', textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-title" style={{ color: 'var(--bg)' }}>
            <RevealText text="Let's Build" delay={0.1} />
            <RevealText text="Something Beautiful" className="yellow-t" delay={0.2} />
          </h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="body-t" 
            style={{ maxWidth: '600px', margin: '1.5rem auto 3rem', color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}
          >
            Ready to transform your vision into reality? Our team is standing by to bring your dream space to life.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <a href="/contact" className="btn-dark" style={{ background: 'var(--yellow)', color: 'var(--dark)' }}>
              <span>Contact Us</span>
              <ArrowRight className="icon-xs" />
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
