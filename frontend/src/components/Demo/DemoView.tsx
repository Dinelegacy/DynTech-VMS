'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import styles from './DemoView.module.css';

export interface CameraStream {
  id: string;
  name: string;        // Dynamic camera name from backend/user session
  streamPath: string;  // e.g. "live/cam1"
}

export interface StreamTelemetry {
  latencyMs: number;
  fps: number;
  protocol: string;
}

interface DemoViewProps {
  /** Dynamic camera data */
  camera?: CameraStream;
  /** Real-time telemetry metrics */
  telemetry?: StreamTelemetry;
  /** Callback for AI toggle */
  onToggleAI?: (enabled: boolean) => void;
}

const DEFAULT_CAMERA: CameraStream = {
  id: 'cam-01',
  name: 'Main Entrance',
  streamPath: 'live/cam1',
};

const DEFAULT_TELEMETRY: StreamTelemetry = {
  latencyMs: 120,
  fps: 30,
  protocol: 'WebRTC (WHEP)',
};

export default function DemoView({
  camera = DEFAULT_CAMERA,
  telemetry = DEFAULT_TELEMETRY,
  onToggleAI,
}: DemoViewProps) {
  const { t } = useLanguage();
  const [showAI, setShowAI] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoStageRef = useRef<HTMLDivElement>(null);

  const mediaMtxBaseUrl = process.env.NEXT_PUBLIC_MEDIAMTX_URL || 'http://localhost:8889';

  const cleanBase = mediaMtxBaseUrl.replace(/\/$/, '');
  const cleanPath = camera.streamPath.replace(/^\//, '').replace(/\/$/, '');
  const streamUrl = `${cleanBase}/${cleanPath}/`;

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!videoStageRef.current) return;

    if (!document.fullscreenElement) {
      if (videoStageRef.current.requestFullscreen) {
        videoStageRef.current.requestFullscreen();
      } else if ((videoStageRef.current as any).webkitRequestFullscreen) {
        (videoStageRef.current as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  };

  const handleAIToggle = () => {
    const nextState = !showAI;
    setShowAI(nextState);
    if (onToggleAI) onToggleAI(nextState);
  };

  return (
    <div className={styles.container}>
      {/* Centered Dashboard / Camera Name Breadcrumb */}
      <div className={styles.dashboardHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/dashboard" className={styles.backLink}>
            Dashboard
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.currentLocation}>{camera.name}</span>
        </div>
      </div>

      <div className={styles.playerCard}>
        {/* Minimal Control Bar: Clean LIVE status + Control Actions */}
        <div className={styles.topBar}>
          <div className={styles.statusGroup}>
            <span className={styles.liveBadge}>
              <span className={styles.liveDot} />
              LIVE
            </span>
          </div>

          <div className={styles.controlsGroup}>
            <label className={styles.switchContainer}>
              <span className={styles.switchLabel}>{t('ai_bounding_boxes')}</span>
              <div className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={showAI} 
                  onChange={handleAIToggle} 
                />
                <span className={styles.slider}></span>
              </div>
            </label>

            <button 
              type="button" 
              onClick={toggleFullscreen} 
              className={styles.fullscreenBtn}
              title="Toggle Fullscreen"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isFullscreen ? (
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                ) : (
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                )}
              </svg>
              <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
            </button>
          </div>
        </div>

        <div className={styles.videoStage} ref={videoStageRef}>
          <iframe
            key={streamUrl}
            src={streamUrl}
            className={styles.streamIframe}
            allow="autoplay; camera; microphone; fullscreen; picture-in-picture"
          />

          {isFullscreen && (
            <button 
              type="button" 
              onClick={toggleFullscreen} 
              className={styles.fullscreenOverlayBtn}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
              <span>Exit Fullscreen</span>
            </button>
          )}
        </div>

        {/* Dynamic Telemetry Footer */}
        <div className={styles.telemetryBar}>
          <div className={styles.telemetryItem}>
            <span className={styles.telemetryLabel}>LATENCY</span>
            <span className={styles.telemetryValue}>{telemetry.latencyMs} ms</span>
          </div>
          <div className={styles.telemetryItem}>
            <span className={styles.telemetryLabel}>FPS</span>
            <span className={styles.telemetryValue}>{telemetry.fps} FPS</span>
          </div>
          <div className={styles.telemetryItem}>
            <span className={styles.telemetryLabel}>PROTOCOL</span>
            <span className={styles.telemetryValue}>{telemetry.protocol}</span>
          </div>
        </div>
      </div>
    </div>
  );
}