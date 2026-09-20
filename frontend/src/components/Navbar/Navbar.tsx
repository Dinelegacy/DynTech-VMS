'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const handleLangChange = (selectedLang: 'en' | 'fr') => {
    setLang(selectedLang);
    setIsLangOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logoGroup}>
          <div className={styles.logoBadge}>D</div>
          <span className={styles.brandName}>DynTech VMS</span>
        </Link>

        <ul className={styles.navMenu}>
          <li><Link href="#overview" className={styles.navLink}>{t('overview')}</Link></li>
          <li><Link href="#platform" className={styles.navLink}>{t('platform')}</Link></li>
          <li><Link href="#pricing" className={styles.navLink}>{t('pricing')}</Link></li>
        </ul>

        <div className={styles.rightActions}>
          <div className={styles.langPicker}>
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={styles.langBtn}
              aria-label="Select Language"
            >
              <svg className={styles.globeIcon} viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.03 8.03 0 0118.93 8zM12 4.04c.83 1.2 1.55 2.59 2.05 3.96h-4.1c.5-1.37 1.22-2.76 2.05-3.96zM4.07 14a7.95 7.95 0 010-4h3.17c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.07zm1 2h2.95c.37 1.3.85 2.5 1.38 3.56A8.03 8.03 0 015.07 16zm2.95-8H5.07a8.03 8.03 0 014.33-3.56A15.65 15.65 0 008.02 8zM12 19.96c-.83-1.2-1.55-2.59-2.05-3.96h4.1c-.5 1.37-1.22 2.76-2.05 3.96zM14.26 14H9.74c-.09-.66-.14-1.32-.14-2s.05-1.34.14-2h4.52c.09.66.14 1.32.14 2zm1.72 5.56c.53-1.06 1.01-2.26 1.38-3.56h2.95a8.03 8.03 0 01-4.33 3.56zM16.76 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.17a7.95 7.95 0 010 4h-3.17z" />
              </svg>
              <span>{lang.toUpperCase()}</span>
            </button>

            {isLangOpen && (
              <div className={styles.langMenu}>
                <button
                  type="button"
                  onClick={() => handleLangChange('en')}
                  className={`${styles.langOption} ${lang === 'en' ? styles.langActive : ''}`}
                >
                  <span>English</span>
                  {lang === 'en' && <span className={styles.checkMark}>✓</span>}
                </button>
                <button
                  type="button"
                  onClick={() => handleLangChange('fr')}
                  className={`${styles.langOption} ${lang === 'fr' ? styles.langActive : ''}`}
                >
                  <span>Français</span>
                  {lang === 'fr' && <span className={styles.checkMark}>✓</span>}
                </button>
              </div>
            )}
          </div>

          <Link href="/login" className={styles.loginLink}>{t('login')}</Link>
          <Link href="/signup" className={styles.trialBtn}>{t('start_trial')}</Link>
        </div>
      </div>
    </header>
  );
}