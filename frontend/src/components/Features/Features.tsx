'use client';

import { motion } from 'framer-motion';
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
          Built for scale.<br />
          <span className={styles.mutedText}>Engineered for zero latency.</span>
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
            <span className={styles.cardTag}>TELEMETRY PIPELINE</span>
          </div>
          <h3 className={styles.cardTitle}>MediaMTX WHEP Engine</h3>
          <p className={styles.cardBody}>
            Direct WebRTC ingestion from standard RTSP streams. Delivers glass-to-glass video latency under 200ms without browser plugins or proprietary gateway hardware.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardNumber}>02</span>
            <span className={styles.cardTag}>SPATIAL ANALYTICS</span>
          </div>
          <h3 className={styles.cardTitle}>Dynamic AI Inference</h3>
          <p className={styles.cardBody}>
            Run edge-level detection models dynamically per camera feed. Instantly index person tracking, bounding box overlays, and spatial incidents across your entire network.
          </p>
        </div>
      </div>
    </section>
  );
}