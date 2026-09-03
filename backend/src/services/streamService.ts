import { spawn, ChildProcess } from 'child_process';
import WebSocket, { WebSocketServer } from 'ws';
import { Pool } from 'pg'; // Your PostgreSQL connection pool

// PostgreSQL connection instance
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface ActiveStream {
  process: ChildProcess;
  wss: WebSocketServer;
}

const activeStreams = new Map<string, ActiveStream>();

export async function startCameraStream(cameraId: string, port: number) {
  // 1. Prevent duplicate streams if camera is already running
  if (activeStreams.has(cameraId)) {
    return activeStreams.get(cameraId);
  }

  // 2. Fetch RTSP URL from your PostgreSQL database
  const result = await db.query('SELECT rtsp_url FROM cameras WHERE id = $1', [cameraId]);
  if (result.rows.length === 0) {
    throw new Error(`Camera with ID ${cameraId} not found in database.`);
  }

  const rtspUrl = result.rows[0].rtsp_url;

  // 3. Create a WebSocket server dedicated to this camera
  const wss = new WebSocketServer({ port });

  // 4. Spawn FFmpeg to convert RTSP stream to browser-friendly MPEG-1 video
  const ffmpegProcess = spawn('ffmpeg', [
    '-rtsp_transport', 'tcp',
    '-i', rtspUrl,
    '-f', 'mpegts',
    '-codec:v', 'mpeg1video',
    '-b:v', '1000k',
    '-r', '25',
    '-',
  ]);

  // 5. Broadcast video chunks to all connected frontend clients
  ffmpegProcess.stdout.on('data', (chunk: Buffer) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(chunk);
      }
    });
  });

  ffmpegProcess.stderr.on('data', (data) => {
    // Console log ffmpeg debug output if needed
  });

  ffmpegProcess.on('close', () => {
    wss.close();
    activeStreams.delete(cameraId);
  });

  const streamInstance = { process: ffmpegProcess, wss };
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