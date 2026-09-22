'use client';

import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useLanguage();

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
           <Link href="/docs" prefetch={false}>Docs</Link>
           <Link href="/terms" prefetch={false}>Terms</Link>
           <Link href="/privacy" prefetch={false}>Privacy</Link>
           <Link href="/support" prefetch={false}>Support</Link>
          </div>
          <span className={styles.copyright}>
            &copy; {new Date().getFullYear()} DynTech VMS. {t('footer_rights')}
          </span>
        </div>
      </div>
    </footer>
  );
}