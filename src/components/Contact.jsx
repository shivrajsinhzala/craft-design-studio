import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Instagram, Send } from 'lucide-react';
import RevealText from './RevealText.jsx';

export default function Contact() {
  const [formStatus, setFormStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => {
      setFormStatus('success');
      e.target.reset();
      setTimeout(() => setFormStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <main className="page-main">
      {/* Hero Section */}
      <section className="contact-hero section" style={{ paddingTop: '180px', paddingBottom: '60px' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="label"
          >
            Get in Touch
          </motion.div>
          
          <h1 className="section-title" style={{ maxWidth: '900px', marginTop: '1rem', marginBottom: '2rem' }}>
            <RevealText text="Let's discuss" delay={0.1} />
            <RevealText text="your next" delay={0.2} />
            <RevealText text="vision." className="yellow-t" delay={0.3} />
          </h1>
        </div>
      </section>

      {/* Content Grid */}
      <section className="contact-content section" style={{ paddingTop: '20px', paddingBottom: '120px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '80px', alignItems: 'start' }}>
          
          {/* Left Column: Info & Locations */}
          <div className="contact-left">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="section-title" 
              style={{ fontSize: '2rem', marginBottom: '1rem' }}
            >
              Our Studios
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="body-t" 
              style={{ marginBottom: '3rem', opacity: 0.85, fontSize: '1.05rem' }}
            >
              Whether you're looking for a complete interior transformation or high-end 3D visual assets, our doors are always open. Drop by for a cup of coffee and a creative chat.
            </motion.p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <motion.address 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start', fontStyle: 'normal' }}
              >
                <div style={{ padding: '16px', background: 'var(--yellow-lt)', color: 'var(--yellow)', borderRadius: '50%' }}>
                  <MapPin style={{ width: 24, height: 24 }} />
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--ff-display)', fontSize: '24px', marginBottom: '8px', color: 'var(--dark)' }}>Morbi Studio</h4>
                  <p style={{ fontSize: '15px', opacity: 0.7, lineHeight: 1.6, color: 'var(--dark)' }}>
                    Craft Design Studio, 1st Floor, Shreeji Arcade,<br/>
                    Opposite VI Store, Sanala Road,<br/>
                    Morbi – 363641, Gujarat
                  </p>
                </div>
              </motion.address>
              
              <motion.address 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start', fontStyle: 'normal' }}
              >
                <div style={{ padding: '16px', background: 'var(--yellow-lt)', color: 'var(--yellow)', borderRadius: '50%' }}>
                  <MapPin style={{ width: 24, height: 24 }} />
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--ff-display)', fontSize: '24px', marginBottom: '8px', color: 'var(--dark)' }}>Rajkot Studio</h4>
                  <p style={{ fontSize: '15px', opacity: 0.7, lineHeight: 1.6, color: 'var(--dark)' }}>
                    Kataria Chowkdi, Near Housing,<br/>
                    Rajkot, Gujarat
                  </p>
                </div>
              </motion.address>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border-2)' }}
            >
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '28px', marginBottom: '1.5rem', color: 'var(--dark)' }}>Direct Contacts</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', fontWeight: '500' }}>Vishvarajsinh Zala</span>
                  <a href="tel:+918758395671" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: 'var(--dark)', opacity: 0.8, textDecoration: 'none' }} className="hover-yellow">
                    <Phone style={{ width: 16, height: 16 }} /> +91 87583 95671
                  </a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', fontWeight: '500' }}>Yash Gharvaliya</span>
                  <a href="tel:+918320695380" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: 'var(--dark)', opacity: 0.8, textDecoration: 'none' }} className="hover-yellow">
                    <Phone style={{ width: 16, height: 16 }} /> +91 83206 95380
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <a href="https://instagram.com/craft_design_studio1" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginTop: '3rem', padding: '14px 28px', background: 'var(--dark)', color: 'var(--bg)', borderRadius: '4px', fontSize: '13px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'background 0.3s ease, transform 0.3s ease' }} onMouseOver={e => e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform='translateY(0)'}>
                <Instagram style={{ width: 20, height: 20 }} />
                <span>@craft_design_studio1</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column: Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="contact-right" 
            style={{ background: 'var(--bg)', padding: '50px', borderRadius: '4px', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}
          >
            <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor="fname" className="label" style={{ marginBottom: 0 }}>Name</label>
                  <input type="text" id="fname" name="name" placeholder="Your full name" required style={{ padding: '16px 0', border: 'none', borderBottom: '1px solid var(--border-2)', background: 'transparent', fontFamily: 'var(--ff-body)', fontSize: '16px', outline: 'none', color: 'var(--dark)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor="femail" className="label" style={{ marginBottom: 0 }}>Email</label>
                  <input type="email" id="femail" name="email" placeholder="your@email.com" required style={{ padding: '16px 0', border: 'none', borderBottom: '1px solid var(--border-2)', background: 'transparent', fontFamily: 'var(--ff-body)', fontSize: '16px', outline: 'none', color: 'var(--dark)' }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                <label htmlFor="fphone" className="label" style={{ marginBottom: 0 }}>Phone</label>
                <input type="tel" id="fphone" name="phone" placeholder="+91 00000 00000" style={{ padding: '16px 0', border: 'none', borderBottom: '1px solid var(--border-2)', background: 'transparent', fontFamily: 'var(--ff-body)', fontSize: '16px', outline: 'none', color: 'var(--dark)' }} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                <label htmlFor="fservice" className="label" style={{ marginBottom: 0 }}>Service</label>
                <select id="fservice" name="service" style={{ padding: '16px 0', border: 'none', borderBottom: '1px solid var(--border-2)', background: 'transparent', fontFamily: 'var(--ff-body)', fontSize: '16px', outline: 'none', color: 'var(--dark)' }}>
                  <option value="">Select a service...</option>
                  <option value="Interior Design">Interior Design</option>
                  <option value="3D Interior Visualization">3D Interior Visualization</option>
                  <option value="Architectural Visualization">Architectural Visualization</option>
                  <option value="3D Floor Plans">3D Floor Plans</option>
                  <option value="Animation Walkthroughs">Animation Walkthroughs</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '40px' }}>
                <label htmlFor="fmsg" className="label" style={{ marginBottom: 0 }}>Project Brief</label>
                <textarea id="fmsg" name="message" rows="4" placeholder="Tell us about your project, timeline, and requirements..." required style={{ padding: '16px 0', border: 'none', borderBottom: '1px solid var(--border-2)', background: 'transparent', fontFamily: 'var(--ff-body)', fontSize: '16px', outline: 'none', resize: 'vertical', color: 'var(--dark)' }}></textarea>
              </div>
              
              <button type="submit" className="btn-dark" disabled={formStatus === 'sending'} style={{ width: '100%', justifyContent: 'space-between', padding: '20px 24px', fontSize: '13px' }}>
                <span>
                  {formStatus === 'idle' && 'Send Message'}
                  {formStatus === 'sending' && 'Sending...'}
                  {formStatus === 'success' && 'Message Sent!'}
                </span>
                {formStatus === 'idle' && <Send style={{ width: 16, height: 16 }} />}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
