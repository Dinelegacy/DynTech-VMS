'use client';

import React, { useState } from 'react';
import styles from './SignUpForm.module.css';

export default function SignUpForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Registration / trial creation API request logic
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoBadge}>D</div>
        <h1 className={styles.title}>Start your free trial</h1>
        <p className={styles.subtitle}>Full access for 14 days. No credit card required.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="fullName" className={styles.label}>Full name</label>
            <input
              id="fullName"
              type="text"
              placeholder="Alex Mercer"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Work email</label>
            <input
              id="email"
              type="email"
              placeholder="alex@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="company" className={styles.label}>Company name</label>
            <input
              id="company"
              type="text"
              placeholder="Acme Systems"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Get Started Free →
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?
          <a href="/login" className={styles.loginLink}>
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}