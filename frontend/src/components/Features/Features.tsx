'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Features.module.css';

const cameraBrands = [
  'AXIS COMMUNICATIONS',
  'HIKVISION',
  'DAHUA TECHNOLOGY',
  'HANWHA VISION',
  'BOSCH SECURITY',
  'AVIGILON',
  'MOBOTIX',
  'SONY SECURITY',
];

export default function Features() {
  const { t } = useLanguage();

  return (
    <section id="features" className={styles.section}>
      {/* Editorial Headline Section */}
      <div className={styles.heroTextContainer}>
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={styles.mainTitle}
        >
          {t('features_heading_1')}<br />
          <span className={styles.mutedText}>{t('features_heading_2')}</span>
        </motion.h2>
      </div>

      {/* Clean Infinite Hardware Marquee Slider */}
      <div className={styles.marqueeSection}>
        <div className={styles.marqueeTrack}>
          <div className={styles.marqueeContent}>
            {cameraBrands.concat(cameraBrands).map((brand, idx) => (
              <span key={idx} className={styles.brandTag}>
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className={styles.gridContainer}>
        <div className={styles.featureCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardNumber}>01</span>
            <span className={styles.cardTag}>{t('features_tag_1')}</span>
          </div>
          <h3 className={styles.cardTitle}>{t('features_title_1')}</h3>
          <p className={styles.cardBody}>
            {t('features_body_1')}
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardNumber}>02</span>
            <span className={styles.cardTag}>{t('features_tag_2')}</span>
          </div>
          <h3 className={styles.cardTitle}>{t('features_title_2')}</h3>
          <p className={styles.cardBody}>
            {t('features_body_2')}
          </p>
        </div>
      </div>
    </section>
  );
}