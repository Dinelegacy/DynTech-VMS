const MEDIAMTX_API_URL = process.env.MEDIAMTX_API_URL || 'http://localhost:9997/v3';

export const registerStreamPath = async (cameraId: string, rtspUrl: string): Promise<void> => {
  try {
    await fetch(`${MEDIAMTX_API_URL}/config/paths/add/${cameraId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: rtspUrl, sourceOnDemand: false }),
    });
  } catch (err) {
    console.error('[MediaMTX Register Error]:', err);
  }
};

export const updateStreamPath = async (cameraId: string, rtspUrl: string): Promise<void> => {
  try {
    await fetch(`${MEDIAMTX_API_URL}/config/paths/patch/${cameraId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: rtspUrl }),
    });
  } catch (err) {
    console.error('[MediaMTX Update Error]:', err);
  }
};

export const unregisterStreamPath = async (cameraId: string): Promise<void> => {
  try {
    await fetch(`${MEDIAMTX_API_URL}/config/paths/remove/${cameraId}`, {
      method: 'POST',
    });
  } catch (err) {
    console.error('[MediaMTX Remove Error]:', err);
  }
};