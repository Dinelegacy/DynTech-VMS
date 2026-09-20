'use client';

import { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import styles from './CameraPlayer.module.css';

export interface CameraPlayerProps {
  cameraId?: string;
  tunnelUrl?: string;
  showAI?: boolean;
}

export default function CameraPlayer({ cameraId = 'live', showAI = true }: CameraPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [isLoadingModel, setIsLoadingModel] = useState<boolean>(true);
  const [isStreamLive, setIsStreamLive] = useState<boolean>(false);

  // 1. Initialize TensorFlow COCO-SSD Model
  useEffect(() => {
    let isMounted = true;
    async function loadModel() {
      try {
        await tf.ready();
        const loadedModel = await cocoSsd.load();
        if (isMounted) {
          setModel(loadedModel);
          setIsLoadingModel(false);
        }
      } catch (err) {
        console.warn('Failed to load COCO-SSD model:', err);
      }
    }
    loadModel();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Initialize WebRTC WHEP connection
  useEffect(() => {
    let pc: RTCPeerConnection | null = null;

    async function startStream() {
      try {
        pc = new RTCPeerConnection();

        pc.ontrack = (event) => {
          if (videoRef.current && event.streams[0]) {
            videoRef.current.srcObject = event.streams[0];
            videoRef.current.play().catch(() => {});
            setIsStreamLive(true);
          }
        };

        pc.addTransceiver('video', { direction: 'recvonly' });
        pc.addTransceiver('audio', { direction: 'recvonly' });

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const response = await fetch('http://localhost:8889/live/whep', {
          method: 'POST',
          headers: { 'Content-Type': 'application/sdp' },
          body: offer.sdp,
        });

        if (response.ok) {
          const answerSdp = await response.text();
          await pc.setRemoteDescription(
            new RTCSessionDescription({ type: 'answer', sdp: answerSdp })
          );
        } else {
          setIsStreamLive(false);
        }
      } catch {
        setIsStreamLive(false);
      }
    }

    startStream();

    return () => {
      if (pc) pc.close();
    };
  }, [cameraId]);

  // 3. Real-time AI Object Detection Loop
  useEffect(() => {
    let animationFrameId: number;

    async function detectFrame() {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState === 4 && isStreamLive) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (showAI && model) {
            const predictions = await model.detect(video);

            predictions.forEach((prediction) => {
              const [x, y, width, height] = prediction.bbox;
              const text = `${prediction.class.toUpperCase()} ${Math.round(prediction.score * 100)}%`;

              ctx.strokeStyle = '#00ff88';
              ctx.lineWidth = 4;
              ctx.strokeRect(x, y, width, height);

              ctx.fillStyle = '#00ff88';
              ctx.font = 'bold 16px sans-serif';
              const textWidth = ctx.measureText(text).width;
              ctx.fillRect(x, y > 26 ? y - 26 : y, textWidth + 12, 26);

              ctx.fillStyle = '#000000';
              ctx.fillText(text, x + 6, y > 26 ? y - 8 : y + 18);
            });
          }
        }
      }

      animationFrameId = requestAnimationFrame(detectFrame);
    }

    detectFrame();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [model, showAI, isStreamLive]);

  return (
    <div className={styles.cardContainer}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={styles.videoFeed}
      />
      <canvas ref={canvasRef} className={styles.overlayCanvas} />

      {!isStreamLive && (
        <div className={styles.offlineOverlay}>
          <span className={styles.offlineTitle}>Camera Stream Offline</span>
          <span className={styles.offlineSubtext}>Start broadcasting from Larix Broadcaster on your phone</span>
        </div>
      )}

      {isLoadingModel && showAI && isStreamLive && (
        <div className={styles.loadingBadge}>
          Loading AI Model...
        </div>
      )}
    </div>
  );
}