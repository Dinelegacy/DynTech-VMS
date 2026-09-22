'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import styles from './SignUpForm.module.css';

export default function SignUpForm() {
  const { t } = useLanguage();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dyntech-vms.onrender.com';

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fullName, 
          name: fullName, 
          company, 
          email, 
          password 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect user to login on successful account creation
        router.push('/login');
      } else {
        setError(data.message || data.error || 'Failed to create account');
      }
    } catch (err) {
      setError('Backend connection error. Unable to reach server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formCard}>
      <h1 className={styles.title}>{t('signup_title')}</h1>
      <p className={styles.subtitle}>{t('signup_subtitle')}</p>

      {error && <p style={{ color: '#ff4d4f', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>{t('full_name_label')}</label>
          <input
            type="text"
            placeholder={t('full_name_placeholder')}
            className={styles.input}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>{t('company_label')}</label>
          <input
            type="text"
            placeholder={t('company_placeholder')}
            className={styles.input}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>{t('email_label')}</label>
          <input
            type="email"
            placeholder={t('email_placeholder')}
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>{t('password_label')}</label>
          <input
            type="password"
            placeholder={t('password_placeholder')}
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Creating...' : t('create_account_btn')}
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