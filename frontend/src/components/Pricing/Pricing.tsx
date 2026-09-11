'use client';

import Link from 'next/link';
import styles from './Pricing.module.css';

const plans = [
  {
    name: 'Starter',
    tagline: 'For localized edge deployments.',
    price: '$290',
    period: '/month',
    features: [
      'Up to 8 active camera streams',
      'MediaMTX WHEP low-latency pipeline',
      '7-day local retention storage',
      'Community support access',
    ],
    highlighted: false,
    cta: 'Start Free Trial',
  },
  {
    name: 'Enterprise',
    tagline: 'For multi-facility infrastructure.',
    price: '$890',
    period: '/month',
    features: [
      'Unlimited camera ingestion',
      'Real-time spatial AI analytics',
      '30-day automated cloud backup',
      'Custom webhook triggers & API',
      '24/7 dedicated support SLA',
    ],
    highlighted: true,
    cta: 'Get Started',
  },
  {
    name: 'Custom',
    tagline: 'Dedicated hardware & air-gapped networks.',
    price: 'Custom',
    period: '',
    features: [
      'On-premise edge server deployment',
      'Custom computer vision model training',
      'Air-gapped security compliance',
      'Dedicated integration engineer',
    ],
    highlighted: false,
    cta: 'Contact Sales',
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Predictable architecture pricing.</h2>
          <p className={styles.subtitle}>Scale camera feeds without per-user penalties or hidden API bandwidth fees.</p>
        </div>

        <div className={styles.grid}>
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`${styles.card} ${plan.highlighted ? styles.cardFeatured : ''}`}
            >
              {plan.highlighted && (
                <div className={styles.featuredBadge}>MOST POPULAR</div>
              )}

              <h3 className={styles.planName}>{plan.name}</h3>
              <p className={styles.planTagline}>{plan.tagline}</p>

              <div className={styles.priceContainer}>
                <span className={styles.price}>{plan.price}</span>
                {plan.period && <span className={styles.period}>{plan.period}</span>}
              </div>

              <ul className={styles.featureList}>
                {plan.features.map((feat, fIdx) => (
                  <li key={fIdx} className={styles.featureItem}>
                    <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/demo" 
                className={plan.highlighted ? styles.primaryBtn : styles.secondaryBtn}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}