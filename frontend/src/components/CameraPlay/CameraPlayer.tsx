'use client';

import { useRef, useEffect } from 'react';
import styles from './CameraPlayer.module.css';

export interface CameraPlayerProps {
  cameraId: string;
  tunnelUrl?: string;
}

export default function CameraPlayer({ cameraId }: CameraPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. Hook to initialize WebRTC stream from MediaMTX
  useEffect(() => {
    const pc = new RTCPeerConnection();

    pc.ontrack = (event) => {
      if (videoRef.current && event.streams[0]) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    pc.addTransceiver('video', { direction: 'recvonly' });

    async function startStream() {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        // Point to your local MediaMTX WHEP endpoint
        const mediaMtxUrl = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.180:8889';
        const response = await fetch(`${mediaMtxUrl}/${cameraId}/whep`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/sdp' },
          body: offer.sdp,
        });

        if (response.ok) {
          const answerSdp = await response.text();
          await pc.setRemoteDescription(
            new RTCSessionDescription({ type: 'answer', sdp: answerSdp })
          );
        }
      } catch (error) {
        console.error('WebRTC connection error:', error);
      }
    }

    startStream();

    return () => {
      pc.close();
    };
  }, [cameraId]);

  // 2. Overlay drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, 150, 200);

    ctx.fillStyle = '#00ff88';
    ctx.font = '14px sans-serif';
    ctx.fillText('Person 98%', 50, 42);
  }, []);

  return (
    <div className={styles.cardContainer}>
      <video ref={videoRef} autoPlay playsInline muted className={styles.videoFeed} />
      <canvas ref={canvasRef} className={styles.overlayCanvas} />
    </div>
  );
}