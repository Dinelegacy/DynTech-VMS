'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import styles from './SignUpForm.module.css';

export default function SignUpForm() {
  const { t } = useLanguage();

  return (
    <div className={styles.formCard}>
      <h1 className={styles.title}>{t('signup_title')}</h1>
      <p className={styles.subtitle}>{t('signup_subtitle')}</p>

      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>{t('full_name_label')}</label>
          <input type="text" placeholder={t('full_name_placeholder')} className={styles.input} required />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>{t('company_label')}</label>
          <input type="text" placeholder={t('company_placeholder')} className={styles.input} required />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>{t('email_label')}</label>
          <input type="email" placeholder={t('email_placeholder')} className={styles.input} required />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>{t('password_label')}</label>
          <input type="password" placeholder={t('password_placeholder')} className={styles.input} required />
        </div>

        <button type="submit" className={styles.submitBtn}>
          {t('create_account_btn')}
        </button>
      </form>

      <p className={styles.footerText}>
        {t('already_have_account')}{' '}
        <Link href="/login" className={styles.link}>
          {t('login')}
        </Link>
      </p>
    </div>
  );
}