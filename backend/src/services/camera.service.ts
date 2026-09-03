import { spawn, ChildProcess } from 'child_process';
import WebSocket, { WebSocketServer } from 'ws';
import { Pool } from 'pg';

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface ActiveStream {
  process: ChildProcess;
  wss: WebSocketServer;
  port: number;
}

const activeStreams = new Map<string, ActiveStream>();

export async function startCameraStream(cameraId: string, port: number) {
  // Prevent duplicate streams if camera is already running
  if (activeStreams.has(cameraId)) {
    return activeStreams.get(cameraId)!;
  }

  // Fetch RTSP URL from PostgreSQL database
  const result = await db.query('SELECT rtsp_url FROM cameras WHERE id = $1', [cameraId]);
  if (result.rows.length === 0) {
    throw new Error(`Camera with ID ${cameraId} not found in database.`);
  }

  const rtspUrl = result.rows[0].rtsp_url;

  // Dedicated WebSocket server for this camera
  const wss = new WebSocketServer({ port });

  // Spawn FFmpeg to convert RTSP to MPEG1/MPEG-TS for browser playback
  const ffmpegProcess = spawn('ffmpeg', [
    '-rtsp_transport', 'tcp',
    '-i', rtspUrl,
    '-f', 'mpegts',
    '-codec:v', 'mpeg1video',
    '-b:v', '1000k',
    '-r', '25',
    '-',
  ]);

  // Broadcast video chunks to all connected WebSocket clients
  ffmpegProcess.stdout.on('data', (chunk: Buffer) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(chunk);
      }
    });
  });

  ffmpegProcess.stderr.on('data', (data) => {
    // Log FFmpeg errors if needed: console.error(`FFmpeg stderr: ${data}`);
  });

  ffmpegProcess.on('close', () => {
    wss.close();
    activeStreams.delete(cameraId);
  });

  const streamInstance = { process: ffmpegProcess, wss, port };
  activeStreams.set(cameraId, streamInstance);

  return streamInstance;
}

export function stopCameraStream(cameraId: string) {
  const stream = activeStreams.get(cameraId);
  if (stream) {
    stream.process.kill('SIGKILL');
    stream.wss.close();
    activeStreams.delete(cameraId);
  }
}