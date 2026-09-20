'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState('admin@dyntech.se');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        router.push('/demo');
      } else {
        setError(data.message || data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Backend connection error. Make sure server is running on http://localhost:5001.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formCard}>
      <h1 className={styles.title}>{t('login_title')}</h1>
      <p className={styles.subtitle}>{t('login_subtitle')}</p>

      {error && <p style={{ color: '#ff4d4d', fontSize: '14px', marginBottom: '12px' }}>{error}</p>}

      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>{t('email_label')}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('email_placeholder')}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>{t('password_label')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('password_placeholder')}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.optionsRow}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" className={styles.checkbox} />
            <span>{t('remember_me')}</span>
          </label>
          <Link href="/forgot-password" className={styles.forgotLink}>
            {t('forgot_password')}
          </Link>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Authenticating...' : t('sign_in_btn')}
        </button>
      </form>

      <p className={styles.footerText}>
        {t('no_account')}{' '}
        <Link href="/signup" className={styles.link}>
          {t('start_trial')}
        </Link>
      </p>
    </div>
  );
}