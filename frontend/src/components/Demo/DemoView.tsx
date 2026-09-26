'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './DemoView.module.css';

export interface CameraStream {
  id: string;
  name: string;
  code?: string;
  streamPath: string;
  isConnected?: boolean;
}

export interface StreamTelemetry {
  latencyMs: number;
  fps: number;
  protocol: string;
}

interface DemoViewProps {
  camera?: CameraStream;
  isConnected?: boolean;
  telemetry?: StreamTelemetry;
  onToggleAI?: (enabled: boolean) => void;
}

interface DetectedObject {
  id: string;
  label: string;
  score: number;
  bbox: [number, number, number, number]; // [x, y, width, height] in percentages
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
  
  const [showAI, setShowAI] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLive, setIsLive] = useState<boolean>(false);
  
  // Real-time dynamic detections array (NO hardcoded "PERSON" or static labels)
  const [detections, setDetections] = useState<DetectedObject[]>([]);
  const [modelLoaded, setModelLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoStageRef = useRef<HTMLDivElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const cocoModelRef = useRef<any>(null);
  const animFrameId = useRef<number | null>(null);

  const mediaMtxBaseUrl = process.env.NEXT_PUBLIC_MEDIAMTX_URL || 'http://localhost:8889';
  const cleanBase = mediaMtxBaseUrl.replace(/\/$/, '');
  const cleanPath = camera.streamPath.replace(/^\//, '').replace(/\/$/, '');
  const whepEndpointUrl = `${cleanBase}/${cleanPath}/whep`;

  // Dynamically load TensorFlow.js & COCO-SSD for real-time client-side object detection
  useEffect(() => {
    let isMounted = true;

    const loadAIEngine = async () => {
      if ((window as any).cocoSsd) {
        if (!cocoModelRef.current) {
          cocoModelRef.current = await (window as any).cocoSsd.load();
        }
        if (isMounted) setModelLoaded(true);
        return;
      }

      // Load TensorFlow.js core
      const script1 = document.createElement('script');
      script1.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js';
      script1.async = true;
      document.body.appendChild(script1);

      script1.onload = () => {
        // Load COCO-SSD object detection model
        const script2 = document.createElement('script');
        script2.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js';
        script2.async = true;
        document.body.appendChild(script2);

        script2.onload = async () => {
          if ((window as any).cocoSsd) {
            cocoModelRef.current = await (window as any).cocoSsd.load();
            if (isMounted) setModelLoaded(true);
          }
        };
      };
    };

    loadAIEngine();
    return () => { isMounted = false; };
  }, []);

  // WebRTC WHEP Connection logic for direct video rendering
  const connectWebRTC = useCallback(async () => {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      peerConnectionRef.current = pc;

      pc.addTransceiver('video', { direction: 'recvonly' });
      pc.addTransceiver('audio', { direction: 'recvonly' });

      pc.ontrack = (event) => {
        if (videoRef.current && event.streams[0]) {
          videoRef.current.srcObject = event.streams[0];
          setIsLive(true);
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const res = await fetch(whepEndpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/sdp' },
        body: offer.sdp,
      });

      if (res.ok) {
        const answerSdp = await res.text();
        await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: answerSdp }));
        setIsLive(true);
      } else {
        setIsLive(false);
      }
    } catch {
      setIsLive(false);
    }
  }, [whepEndpointUrl]);

  useEffect(() => {
    connectWebRTC();
    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [connectWebRTC]);

  // Real-time Vision Detection Loop on live video stream
  const runDetection = useCallback(async () => {
    if (
      showAI &&
      videoRef.current &&
      videoRef.current.readyState === 4 &&
      cocoModelRef.current
    ) {
      try {
        const predictions = await cocoModelRef.current.detect(videoRef.current);
        const videoWidth = videoRef.current.videoWidth || 1;
        const videoHeight = videoRef.current.videoHeight || 1;

        const mapped: DetectedObject[] = predictions.map((pred: any, index: number) => {
          const [x, y, width, height] = pred.bbox;
          return {
            id: `${pred.class}-${index}`,
            label: pred.class.toUpperCase(), // Real detected object name (e.g. CHAIR, TABLE, BOTTLE, PHONE)
            score: +(pred.score * 100).toFixed(1),
            bbox: [
              (x / videoWidth) * 100,
              (y / videoHeight) * 100,
              (width / videoWidth) * 100,
              (height / videoHeight) * 100,
            ],
          };
        });

        setDetections(mapped);
      } catch (err) {
        console.error('Detection frame error:', err);
      }
    }

    if (showAI) {
      animFrameId.current = requestAnimationFrame(runDetection);
    }
  }, [showAI]);

  useEffect(() => {
    if (showAI) {
      runDetection();
    } else {
      setDetections([]);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    }
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [showAI, runDetection]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!videoStageRef.current) return;
    if (!document.fullscreenElement) {
      videoStageRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
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
        {/* Top Control Bar */}
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
              <span className={styles.switchLabel}>
                {t('ai_bounding_boxes')} {showAI && !modelLoaded && '(Loading AI...)'}
              </span>
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
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
              <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
            </button>
          </div>
        </div>

        {/* Video Stage */}
        <div className={styles.videoStage} ref={videoStageRef} style={{ position: 'relative', overflow: 'hidden', background: '#000' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />

          {/* Dynamic AI Detection Engine Layer */}
          {showAI && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 10
            }}>
              <style>{`
                @keyframes aiScanLine {
                  0% { top: 0%; opacity: 0.8; }
                  50% { top: 96%; opacity: 0.8; }
                  100% { top: 0%; opacity: 0.8; }
                }
              `}</style>

              {/* Scanning Line */}
              <div style={{
                position: 'absolute',
                left: 0,
                width: '100%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #00ffaa, transparent)',
                boxShadow: '0 0 12px #00ffaa',
                animation: 'aiScanLine 3s ease-in-out infinite'
              }} />

              {/* Real Detected Objects Render */}
              {detections.map((item) => {
                const [x, y, w, h] = item.bbox;
                return (
                  <React.Fragment key={item.id}>
                    {/* Bounding Box */}
                    <div style={{
                      position: 'absolute',
                      top: `${y}%`,
                      left: `${x}%`,
                      width: `${w}%`,
                      height: `${h}%`,
                      border: '1.5px dashed #00ffaa',
                      background: 'rgba(0, 255, 170, 0.08)',
                      boxShadow: '0 0 8px rgba(0, 255, 170, 0.3)',
                      transition: 'all 0.05s linear'
                    }} />

                    {/* Live Object Label */}
                    <div style={{
                      position: 'absolute',
                      top: `${Math.max(0, y - 3)}%`,
                      left: `${x}%`,
                      background: '#00ffaa',
                      color: '#000',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '2px',
                      fontFamily: 'monospace',
                      letterSpacing: '0.5px',
                      boxShadow: '0 2px 8px rgba(0, 255, 170, 0.5)',
                      whiteSpace: 'nowrap',
                      zIndex: 11
                    }}>
                      {item.label} {item.score}%
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>

        {/* Telemetry Footer */}
        <div className={styles.telemetryBar}>
          <div className={styles.telemetryItem}>
            <span className={styles.telemetryLabel}>LATENCY</span>
            <span className={styles.telemetryValue}>{isLive ? `${telemetry?.latencyMs ?? 120} ms` : '--'}</span>
          </div>
          <div className={styles.telemetryItem}>
            <span className={styles.telemetryLabel}>FPS</span>
            <span className={styles.telemetryValue}>{isLive ? `${telemetry?.fps ?? 30} FPS` : '--'}</span>
          </div>
          <div className={styles.telemetryItem}>
            <span className={styles.telemetryLabel}>PROTOCOL</span>
            <span className={styles.telemetryValue}>{telemetry?.protocol ?? 'WebRTC (WHEP)'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}