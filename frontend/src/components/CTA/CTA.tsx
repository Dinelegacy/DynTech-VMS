'use client';

import Link from 'next/link';
import styles from './CTA.module.css';

export default function CTA() {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <h2 className={styles.title}>Ready to modernize your cameras?</h2>
        <p className={styles.subtitle}>
          Join security teams already running DynTech VMS. No hardware lock-in, no long-term contracts.
        </p>

        <div className={styles.actionWrapper}>
          <Link href="/demo" className={styles.primaryBtn}>
            Start Free Trial &rarr;
          </Link>
          <span className={styles.finePrint}>
            No credit card required &middot; 14-day free trial &middot; Cancel anytime
          </span>
        </div>
      </div>
    </section>
  );
}