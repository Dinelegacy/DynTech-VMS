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
            <Link href="/privacy" className={styles.link}>{t('footer_privacy')}</Link>
            <Link href="/terms" className={styles.link}>{t('footer_terms')}</Link>
            <Link href="/docs" className={styles.link}>{t('footer_docs')}</Link>
            <Link href="/support" className={styles.link}>{t('footer_support')}</Link>
          </div>
          <span className={styles.copyright}>
            &copy; {new Date().getFullYear()} DynTech VMS. {t('footer_rights')}
          </span>
        </div>
      </div>
    </footer>
  );
}