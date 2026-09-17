'use client';

import React from 'react';
import Link from 'next/link';
import styles from './DemoView.module.css';

export default function DemoView() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Live Pipeline Preview</h1>
        <p className={styles.subtitle}>
          Sub-second WebRTC canvas object detection on RTSP edge feeds
        </p>
      </div>

      <div className={styles.layout}>
        <div className={styles.videoCard}>
          <div className={styles.videoScreen}>
            <div className={styles.liveBadge}>
              <span className={styles.liveDot} /> LIVE FEED
            </div>
            <div className={styles.boundingBox}>
              <span className={styles.label}>Person 98%</span>
            </div>
          </div>
          <div className={styles.videoFooter}>
            <span>Cam-01 // Entrance Gate</span>
            <span>1080p @ 60 FPS</span>
          </div>
        </div>

        <div className={styles.metricsCard}>
          <h2 className={styles.metricsTitle}>Stream Metrics</h2>

          <div className={styles.metricRow}>
            <span className={styles.metricLabel}>Protocol</span>
            <span className={styles.metricValue}>WebRTC (MediaMTX)</span>
          </div>

          <div className={styles.metricRow}>
            <span className={styles.metricLabel}>End-to-End Latency</span>
            <span className={styles.metricValue} style={{ color: '#00c853' }}>84 ms</span>
          </div>

          <div className={styles.metricRow}>
            <span className={styles.metricLabel}>Canvas Engine</span>
            <span className={styles.metricValue}>Edge Tensor</span>
          </div>

          <div className={styles.metricRow}>
            <span className={styles.metricLabel}>Active Detections</span>
            <span className={styles.metricValue}>1 Object</span>
          </div>

          <Link href="/signup" className={styles.ctaBtn}>
            Start Free Trial →
          </Link>
        </div>
      </div>
    </div>
  );
}