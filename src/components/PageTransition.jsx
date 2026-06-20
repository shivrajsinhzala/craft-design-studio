import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const overlayVariants1 = {
  initial: { scaleY: 0 },
  animate: { scaleY: 0 },
  exit: {
    scaleY: 1,
    transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
  },
};

const overlayVariants2 = {
  initial: { scaleY: 0 },
  animate: { scaleY: 0 },
  exit: {
    scaleY: 1,
    transition: { duration: 0.65, delay: 0.1, ease: [0.76, 0, 0.24, 1] },
  },
};

const enterOverlayVariants = {
  initial: { scaleY: 1 },
  animate: {
    scaleY: 0,
    transition: { duration: 0.65, delay: 0.15, ease: [0.76, 0, 0.24, 1] },
  },
  exit: { scaleY: 0 },
};

export default function PageTransition({ children }) {
  return (
    <>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>

      {/* Exit Panel 1 (Golden accent slide-up) */}
      <motion.div
        variants={overlayVariants2}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: '#E8B84B', // Golden Yellow
          zIndex: 99998,
          transformOrigin: 'bottom',
          pointerEvents: 'none',
        }}
      />

      {/* Exit Panel 2 (Dark Slate slide-up) */}
      <motion.div
        variants={overlayVariants1}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: '#141210', // Dark Slate
          zIndex: 99999,
          transformOrigin: 'bottom',
          pointerEvents: 'none',
        }}
      />

      {/* Entry Panel (Dark Slate slide-up reveal) */}
      <motion.div
        variants={enterOverlayVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: '#141210', // Dark Slate
          zIndex: 99999,
          transformOrigin: 'top',
          pointerEvents: 'none',
        }}
      />
    </>
  );
}
