const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface StartStreamResponse {
  message: string;
  wsPort: number;
}

export async function startCameraStream(cameraId: string): Promise<StartStreamResponse> {
  const response = await fetch(`${API_URL}/cameras/${cameraId}/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  return response.json();
}