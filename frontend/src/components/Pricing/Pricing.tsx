'use client';

import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Pricing.module.css';

export default function Pricing() {
  const { t } = useLanguage();

  const plans = [
    {
      name: t('plan_starter_name'),
      tagline: t('plan_starter_tagline'),
      price: '999 kr',
      period: t('plan_period_month') || '/mån',
      features: [
        t('plan_starter_f1'),
        t('plan_starter_f2'),
        t('plan_starter_f3'),
        t('plan_starter_f4'),
      ],
      highlighted: false,
      cta: t('start_trial'),
    },
    {
      name: t('plan_enterprise_name'),
      tagline: t('plan_enterprise_tagline'),
      price: '1 999 kr',
      period: t('plan_period_month') || '/mån',
      features: [
        t('plan_enterprise_f1'),
        t('plan_enterprise_f2'),
        t('plan_enterprise_f3'),
        t('plan_enterprise_f4'),
        t('plan_enterprise_f5'),
      ],
      highlighted: true,
      cta: t('get_started'),
    },
    {
      name: t('plan_custom_name'),
      tagline: t('plan_custom_tagline'),
      price: t('plan_custom_price') || 'Offert',
      period: '',
      features: [
        t('plan_custom_f1'),
        t('plan_custom_f2'),
        t('plan_custom_f3'),
        t('plan_custom_f4'),
      ],
      highlighted: false,
      cta: t('contact_sales'),
    },
  ];

  return (
    <section id="pricing" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('pricing_title')}</h2>
          <p className={styles.subtitle}>{t('pricing_subtitle')}</p>
        </div>

        <div className={styles.grid}>
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`${styles.card} ${plan.highlighted ? styles.cardFeatured : ''}`}
            >
              {plan.highlighted && (
                <div className={styles.featuredBadge}>{t('most_popular') || 'Populärast'}</div>
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
                    <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
                {plan.cta} &rarr;
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}