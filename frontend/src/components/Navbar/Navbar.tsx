'use client';

import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand}>
          <div className={styles.logoBadge}>D</div>
          <span className={styles.brandName}>DynTech VMS</span>
        </Link>

        <nav className={styles.navLinks}>
          <Link href="#overview" className={styles.navLink}>Overview</Link>
          <Link href="#features" className={styles.navLink}>Platform</Link>
          <Link href="#pricing" className={styles.navLink}>Pricing</Link>
        </nav>

        <div className={styles.actions}>
          <Link href="/login" className={styles.loginBtn}>Log In</Link>
          <Link href="/demo" className={styles.ctaBtn}>Start Free Trial</Link>
        </div>
      </div>
    </header>
  );
}