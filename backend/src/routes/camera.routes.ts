import { Router, Request, Response } from 'express';
import { startCameraStream, stopCameraStream } from '../services/camera.service';

const router = Router();

interface CameraParams {
  id: string;
}

router.post('/cameras/:id/start', async (req: Request<CameraParams>, res: Response) => {
  try {
    const { id } = req.params; 
    const port = 8081;

    const stream = await startCameraStream(id, port);

    res.status(200).json({
      message: 'Stream started successfully',
      wsPort: stream.port,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});