'use client';

import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandRow}>
          <div className={styles.logoGroup}>
            <div className={styles.logoBadge}>D</div>
            <span className={styles.brandName}>DynTech VMS</span>
          </div>
        </div>

        <div className={styles.navRow}>
          <div className={styles.links}>
            <Link href="/privacy" className={styles.link}>Privacy</Link>
            <Link href="/terms" className={styles.link}>Terms</Link>
            <Link href="/docs" className={styles.link}>Docs</Link>
            <Link href="/support" className={styles.link}>Support</Link>
          </div>
          <span className={styles.copyright}>
            &copy; {new Date().getFullYear()} DynTech VMS. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}