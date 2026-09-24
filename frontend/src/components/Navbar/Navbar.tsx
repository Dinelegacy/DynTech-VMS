'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);

  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token) {
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            setUser({ email: 'admin@dyntech.se' });
          }
        } else {
          setUser({ email: 'admin@dyntech.se' });
        }
      } else {
        setUser(null);
      }
    };

    syncAuth();
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsProfileOpen(false);
    router.push('/login');
  };

  const handleLangChange = (selectedLang: 'en' | 'fr') => {
    setLang(selectedLang);
    setIsLangOpen(false);
  };

  const getInitials = (emailStr?: string) => {
    if (!emailStr) return 'AD';
    const username = emailStr.split('@')[0];
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        {/* Brand Logo */}
        <Link href="/" className={styles.logoGroup}>
          <div className={styles.logoBadge}>D</div>
          <span className={styles.brandName}>DynTech VMS</span>
        </Link>

        {/* Center Links */}
        <ul className={styles.navMenu}>
          <li><Link href="#overview" className={styles.navLink}>{t('overview')}</Link></li>
          <li><Link href="#platform" className={styles.navLink}>{t('platform')}</Link></li>
          <li><Link href="#pricing" className={styles.navLink}>{t('pricing')}</Link></li>
        </ul>

        {/* Right Action Group */}
        <div className={styles.rightActions}>
          {/* Language Switcher */}
          <div className={styles.langPicker}>
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={styles.langBtn}
              aria-label="Select Language"
            >
              <svg className={styles.globeIcon} viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.03 8.03 0 0118.93 8zM12 4.04c.83 1.2 1.55 2.59 2.05 3.96h-4.1c.5-1.37 1.22-2.76 2.05-3.96zM4.07 14a7.95 7.95 0 010-4h3.17c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.07zm1 2h2.95c.37 1.3.85 2.5 1.38 3.56A8.03 8.03 0 015.07 16zm2.95-8H5.07a8.03 8.03 0 014.33-3.56A15.65 15.65 0 008.02 8zM12 19.96c-.83-1.2-1.55-2.59-2.05-3.96h4.1c-.5 1.37 1.22 2.76-2.05 3.96zM14.26 14H9.74c-.09-.66-.14-1.32-.14-2s.05-1.34.14-2h4.52c.09.66.14 1.32.14 2zm1.72 5.56c.53-1.06 1.01-2.26 1.38-3.56h2.95a8.03 8.03 0 01-4.33 3.56zM16.76 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.17a7.95 7.95 0 010 4h-3.17z" />
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

          {/* User Profile / Auth State */}
          {user ? (
            <div className={styles.profileWrapper} ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={styles.avatarBtn}
                aria-label="User profile menu"
              >
                <div className={styles.avatarBadge}>
                  {getInitials(user.email)}
                </div>
              </button>

              {isProfileOpen && (
                <div className={styles.profileDropdown}>
                  {/* Account Header Info */}
                  <div className={styles.profileHeader}>
                    <p className={styles.userEmail}>{user.email}</p>
                    <span className={styles.roleBadge}>System Admin</span>
                  </div>

                  <div className={styles.dropdownDivider} />

                  {/* VMS Quick Navigation Links */}
                  <div className={styles.menuGroup}>
                    <a href="#account" className={styles.menuItem}>
                      <svg className={styles.menuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Account Settings
                    </a>
                    <a href="#system" className={styles.menuItem}>
                      <svg className={styles.menuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                      </svg>
                      System Health
                    </a>
                  </div>

                  <div className={styles.dropdownDivider} />

                  {/* Sign Out Action */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={styles.signOutBtn}
                  >
                    <svg className={styles.signOutIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className={styles.loginLink}>{t('login')}</Link>
              <Link href="/signup" className={styles.trialBtn}>{t('start_trial')}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}