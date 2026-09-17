'use client';

import React, { useState } from 'react';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoBadge}>D</div>
        <h1 className={styles.title}>Sign in to DynTech</h1>
        <p className={styles.subtitle}>Enter your details to access the VMS platform</p>

        <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email address</label>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <a href="#" className={styles.forgotLink}>Forgot?</a>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Log In →
          </button>
        </form>

        <p className={styles.footer}>
          Don't have an account?
          <a href="/signup" className={styles.signupLink}>
            Start Free Trial
          </a>
        </p>
      </div>
    </div>
  );
}