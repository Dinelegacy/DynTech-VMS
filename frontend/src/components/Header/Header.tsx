'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={styles.title}
        >
          Transform RTSP Cameras into Intelligent VMS Feeds
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className={styles.subtitle}
        >
          Sub-second WebRTC streaming powered by MediaMTX with real-time browser canvas object detection and localized edge management.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
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