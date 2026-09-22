'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
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
          {/* Fallback layer when camera is off or connecting */}
          <div className={styles.videoPlaceholder}>
            <span className={styles.feedText}>{t('camera_stream_1')} — WAITING FOR STREAM SIGNAL</span>
          </div>

          {/* WebRTC Live Stream Frame */}
          <iframe
            src="https://vdo.ninja/?view=dyntechvms&autoplay=1&cleanoutput=1&cover=1&transparent=1"
            className={styles.videoIframe}
            allow="autoplay; camera; microphone; fullscreen; picture-in-picture"
          />

          {/* Simulated AI Detection Overlay */}
          {showAI && (
            <div className={styles.mockBoundingBox}>
              <span className={styles.boxLabel}>PERSON 98%</span>
            </div>
          )}
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