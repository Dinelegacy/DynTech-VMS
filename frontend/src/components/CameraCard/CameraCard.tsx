'use client';

import { useRef, useEffect } from 'react'; // 1. Import useEffect
import styles from './CameraCard.module.css';

export default function CameraCard({ cameraId }: { cameraId: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 2. Place useEffect INSIDE the component body, before the return statement
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

  // 3. Return your JSX at the end
  return (
    <div className={styles.cardContainer}>
      <video ref={videoRef} autoPlay playsInline muted className={styles.videoFeed} />
      <canvas ref={canvasRef} className={styles.overlayCanvas} />
    </div>
  );
}