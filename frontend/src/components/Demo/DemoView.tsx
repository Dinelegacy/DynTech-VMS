'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import CameraPlayer from '../CameraPlay/CameraPlayer';
import styles from './DemoView.module.css';

export default function DemoView() {
  const { t } = useLanguage();
  const [showAI, setShowAI] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('demo_title')}</h1>
        <p className={styles.subtitle}>{t('demo_subtitle')}</p>
      </div>

      <div className={styles.playerCard}>
        <div className={styles.topBar}>
          <div className={styles.statusGroup}>
            <span className={styles.liveBadge}>
              <span className={styles.liveDot} />
              {t('stream_status_live')}
            </span>
            <span className={styles.streamName}>{t('camera_stream_1')}</span>
          </div>

          <label className={styles.toggleLabel}>
            <input 
              type="checkbox" 
              checked={showAI} 
              onChange={() => setShowAI(!showAI)} 
              className={styles.toggleInput}
            />
            <span>{t('ai_bounding_boxes')}</span>
          </label>
        </div>

        <div className={styles.videoStage}>
          <CameraPlayer cameraId="live" showAI={showAI} />
        </div>

        <div className={styles.telemetryBar}>
          <div className={styles.telemetryItem}>
            <span className={styles.telemetryLabel}>{t('latency_label')}:</span>
            <span className={styles.telemetryValue}>120ms</span>
          </div>
          <div className={styles.telemetryItem}>
            <span className={styles.telemetryLabel}>{t('fps_label')}:</span>
            <span className={styles.telemetryValue}>30 FPS</span>
          </div>
        </div>
      </div>

      <Link href="/" className={styles.backBtn}>
        &larr; {t('back_home')}
      </Link>
    </div>
  );
}