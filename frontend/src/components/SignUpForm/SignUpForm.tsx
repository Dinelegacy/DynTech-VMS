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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

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
        router.push('/login');
      } else {
        setError(data.message || data.error || 'Failed to create account');
      }
    } catch {
      setError('Backend connection error. Unable to reach server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoBadge}>D</div>

        <h1 className={styles.title}>{t('signup_title') || 'Start your 14-day free trial'}</h1>
        <p className={styles.subtitle}>
          {t('signup_subtitle') || 'No credit card required. Instant WebRTC camera connection.'}
        </p>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form} autoComplete="off">
          <div className={styles.inputGroup}>
            <label className={styles.label}>{t('full_name_label') || 'Full Name'}</label>
            <input
              type="text"
              placeholder={t('full_name_placeholder') || 'Jane Doe'}
              className={styles.input}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="off"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>{t('company_label') || 'Company Name'}</label>
            <input
              type="text"
              placeholder={t('company_placeholder') || 'Acme Security'}
              className={styles.input}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              autoComplete="off"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>{t('email_label') || 'Email Address'}</label>
            <input
              type="email"
              placeholder={t('email_placeholder') || 'name@company.com'}
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>{t('password_label') || 'Password'}</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('password_placeholder') || '••••••••'}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating Account...' : t('create_account_btn') || 'Create Free Account'}
          </button>
        </form>

        <p className={styles.footerText}>
          {t('already_have_account') || 'Already have an account?'}{' '}
          <Link href="/login" className={styles.link}>
            {t('login') || 'Log In'}
          </Link>
        </p>
      </div>
    </div>
  );
}