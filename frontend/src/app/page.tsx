'use client';

import Hero from '../components/Hero/Hero';
import Features from '../components/Features/Features';
import Pricing from '../components/Pricing/Pricing';
import CTA from '../components/CTA/CTA';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.mainWrapper}>
      <Hero />
      <Features />
      <Pricing />
      <CTA />
    </div>
  );
}