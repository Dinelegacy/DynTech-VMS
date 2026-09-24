'use client';

import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import styles from './CTA.module.css';

export default function CTA() {
  const { t } = useLanguage();

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <h2 className={styles.title}>{t('cta_title')}</h2>
        <p className={styles.subtitle}>
          {t('cta_subtitle')}
        </p>

        <div className={styles.actionWrapper}>
          <Link href="/demo" className={styles.primaryBtn}>
            <span>{t('start_trial')}</span>
            <span>&rarr;</span>
          </Link>
          <span className={styles.finePrint}>
            {t('cta_fine_print')}
          </span>
        </div>
      </div>
    </section>
  );
}