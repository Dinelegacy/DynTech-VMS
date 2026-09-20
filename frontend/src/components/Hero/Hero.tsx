'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
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
  const { t } = useLanguage();

  return (
    <section className={styles.hero}>
      {/* Full Page Background Layer (Reserved for your video background) */}
      <div className={styles.backgroundContainer} />

      {/* Left Overlay Content */}
      <div className={styles.contentWrapper}>
        <motion.h1 
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className={styles.title}
        >
          {t('hero_title')}
        </motion.h1>

        <motion.p 
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className={styles.subtitle}
        >
          {t('hero_subtitle')}
        </motion.p>

        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className={styles.actions}
        >
          <Link href="/demo" className={styles.greenBtn}>
            {t('book_demo')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}