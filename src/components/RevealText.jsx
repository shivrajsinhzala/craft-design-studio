import React from 'react';
import { motion } from 'framer-motion';

export default function RevealText({ text, className, delay = 0 }) {
  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04,
        delayChildren: delay,
      },
    },
  };

  const childVariants = {
    hidden: {
      y: '115%',
      rotate: 3,
    },
    visible: {
      y: '0%',
      rotate: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1], // premium custom cubic-bezier (easeOutExpo)
      },
    },
  };

  return (
    <motion.span
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-5%' }}
      style={{ display: 'inline-flex', flexWrap: 'wrap', overflow: 'visible' }}
    >
      {words.map((word, idx) => (
        <span
          key={idx}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            marginRight: '0.25em',
            paddingBottom: '0.25em',
            marginBottom: '-0.25em',
          }}
        >
          <motion.span
            variants={childVariants}
            style={{ display: 'inline-block', transformOrigin: 'left bottom' }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
