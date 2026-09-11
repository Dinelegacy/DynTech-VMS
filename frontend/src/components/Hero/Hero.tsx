'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import styles from './Hero.module.css';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.12,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Ambient Motion Background */}
      <div className={styles.ambientCanvas}>
        <motion.div 
          animate={{
            x: [-100, 100, -50, -100],
            y: [-50, 100, 50, -50],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={styles.orb1}
        />
        <motion.div 
          animate={{
            x: [100, -100, 50, 100],
            y: [50, -100, -50, 50],
            scale: [0.9, 1.1, 1, 0.9],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={styles.orb2}
        />
      </div>

      <div className={styles.container}>
        <motion.h1 
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className={styles.title}
        >
          Transform RTSP Cameras into Intelligent VMS Feeds
        </motion.h1>

        <motion.p 
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className={styles.subtitle}
        >
          Sub-second WebRTC streaming powered by MediaMTX with real-time browser canvas object detection and localized edge management.
        </motion.p>

        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className={styles.actions}
        >
          <Link href="/demo" className={styles.primaryBtn}>
            Start Free Trial &rarr;
          </Link>
          <Link href="#features" className={styles.secondaryBtn}>
            Explore Pipeline
          </Link>
        </motion.div>
      </div>
    </section>
  );
}