'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './DemoView.module.css';

export interface CameraStream {
  id: string;
  name: string;         // Dynamic camera name
  code?: string;        // Optional camera tag (e.g., "CAM-01")
  streamPath: string;   // e.g. "live/cam1"
  isConnected?: boolean; // Server override flag
}

export interface StreamTelemetry {
  latencyMs: number;
  fps: number;
  protocol: string;
}

interface DemoViewProps {
  /** Dynamic camera configuration */
  camera?: CameraStream;
  /** Direct connection status override */
  isConnected?: boolean;
  /** Stream telemetry metrics */
  telemetry?: StreamTelemetry;
  /** Callback for AI toggle button */
  onToggleAI?: (enabled: boolean) => void;
}

const DEFAULT_CAMERA: CameraStream = {
  id: 'cam-01',
  name: 'Main Entrance',
  streamPath: 'live/cam1',
};

export default function DemoView({
  camera = DEFAULT_CAMERA,
  isConnected,
  telemetry,
  onToggleAI,
}: DemoViewProps) {
  const { t } = useLanguage();
  const [showAI, setShowAI] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Default strictly to false so it never flashes LIVE on login/render
  const [isLive, setIsLive] = useState<boolean>(false);
  
  const videoStageRef = useRef<HTMLDivElement>(null);

  const mediaMtxBaseUrl = process.env.NEXT_PUBLIC_MEDIAMTX_URL || 'http://localhost:8889';
  const cleanBase = mediaMtxBaseUrl.replace(/\/$/, '');
  const cleanPath = camera.streamPath.replace(/^\//, '').replace(/\/$/, '');
  
  const streamIframeUrl = `${cleanBase}/${cleanPath}/`;
  const whepEndpointUrl = `${cleanBase}/${cleanPath}/whep`;

  // Accurate MediaMTX stream status verification
  const checkStreamHealth = useCallback(async () => {
    // 1. Honor explicit boolean prop overrides if provided
    if (typeof isConnected === 'boolean') {
      setIsLive(isConnected);
      return;
    }
    if (typeof camera.isConnected === 'boolean') {
      setIsLive(camera.isConnected);
      return;
    }

    try {
      // 2. Ping MediaMTX WHEP endpoint.
      // If no stream publisher is active, MediaMTX returns 404 Not Found.
      // If a publisher is active, it returns 400 (Bad Request - missing offer) or 201/405.
      const res = await fetch(whepEndpointUrl, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/sdp' },
        cache: 'no-store' 
      });

      if (res.status === 404) {
        setIsLive(false);
      } else {
        // Status 400, 405, 201, etc. indicate an active publisher path on MediaMTX
        setIsLive(true);
      }
    } catch {
      // Network failure or MediaMTX offline
      setIsLive(false);
    }
  }, [whepEndpointUrl, isConnected, camera.isConnected]);

  useEffect(() => {
    // Initial check on load/login
    checkStreamHealth();

    // Poll status every 3 seconds to auto-toggle when camera turns on/off
    const interval = setInterval(checkStreamHealth, 3000);
    return () => clearInterval(interval);
  }, [checkStreamHealth]);

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
      <div className={styles.playerCard}>
        {/* Top Control Bar with Accurate Status & Dynamic Camera Name */}
        <div className={styles.topBar}>
          <div className={styles.statusGroup}>
            <span className={isLive ? styles.liveBadge : styles.offlineBadge}>
              <span className={isLive ? styles.liveDot : styles.offlineDot} />
              {isLive ? 'LIVE' : 'OFFLINE'}
            </span>

            {camera.code && <span className={styles.camTag}>{camera.code}</span>}
            <span className={styles.cameraTitle}>{camera.name}</span>
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

        {/* Video Stage */}
        <div className={styles.videoStage} ref={videoStageRef}>
          <iframe
            key={streamIframeUrl}
            src={streamIframeUrl}
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

        {/* Telemetry Footer Bar */}
        <div className={styles.telemetryBar}>
          <div className={styles.telemetryItem}>
            <span className={styles.telemetryLabel}>LATENCY</span>
            <span className={styles.telemetryValue}>
              {isLive ? `${telemetry?.latencyMs ?? 120} ms` : '--'}
            </span>
          </div>
          <div className={styles.telemetryItem}>
            <span className={styles.telemetryLabel}>FPS</span>
            <span className={styles.telemetryValue}>
              {isLive ? `${telemetry?.fps ?? 30} FPS` : '--'}
            </span>
          </div>
          <div className={styles.telemetryItem}>
            <span className={styles.telemetryLabel}>PROTOCOL</span>
            <span className={styles.telemetryValue}>
              {telemetry?.protocol ?? 'WebRTC (WHEP)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}