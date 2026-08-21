import { Request, Response } from 'express';
import { prisma } from '../config/database';
import {
  registerStreamPath,
  updateStreamPath,
  unregisterStreamPath,
} from '../services/mediamtx.service';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

// 1. GET ALL CAMERAS FOR LOGGED-IN USER
export const getCameras = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized user.' });
      return;
    }

    const cameras = await prisma.camera.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      count: cameras.length,
      cameras,
    });
  } catch (error) {
    console.error('Get Cameras Error:', error);
    res.status(500).json({ error: 'Internal server error while fetching cameras.' });
  }
};

// 2. CREATE A NEW CAMERA (WITH QUOTA ENFORCEMENT & MEDIAMTX)
export const createCamera = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized user.' });
      return;
    }

    const { name, rtspUrl } = req.body;

    if (!name || !rtspUrl) {
      res.status(400).json({ error: 'Camera name and RTSP URL are required.' });
      return;
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription || !subscription.isActive) {
      res.status(403).json({ error: 'Active subscription required to add cameras.' });
      return;
    }

    const currentCameraCount = await prisma.camera.count({
      where: { userId },
    });

    const maxAllowed = subscription.maxCameras + subscription.extraCameras;

    if (currentCameraCount >= maxAllowed) {
      res.status(403).json({
        error: `Camera limit reached (${currentCameraCount}/${maxAllowed}). Upgrade your ${subscription.tier} plan or purchase extra camera add-ons (75 SEK/mo each).`,
        tier: subscription.tier,
        currentCount: currentCameraCount,
        maxAllowed,
        currency: subscription.currency,
      });
      return;
    }

    const newCamera = await prisma.camera.create({
      data: {
        userId,
        name,
        rtspUrl,
      },
    });

    // Register live stream path in MediaMTX
    await registerStreamPath(newCamera.id, newCamera.rtspUrl);

    res.status(201).json({
      message: 'Camera added successfully',
      camera: newCamera,
    });
  } catch (error) {
    console.error('Create Camera Error:', error);
    res.status(500).json({ error: 'Internal server error while adding camera.' });
  }
};

// 3. UPDATE CAMERA
export const updateCamera = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { name, rtspUrl } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized user.' });
      return;
    }

    if (!id) {
      res.status(400).json({ error: 'Camera ID parameter is required.' });
      return;
    }

    const existingCamera = await prisma.camera.findFirst({
      where: { id, userId },
    });

    if (!existingCamera) {
      res.status(404).json({ error: 'Camera not found or access denied.' });
      return;
    }

    const updatedCamera = await prisma.camera.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(rtspUrl && { rtspUrl }),
      },
    });

    // Update MediaMTX if RTSP URL changed
    if (rtspUrl) {
      await updateStreamPath(id, rtspUrl);
    }

    res.status(200).json({
      message: 'Camera updated successfully',
      camera: updatedCamera,
    });
  } catch (error) {
    console.error('Update Camera Error:', error);
    res.status(500).json({ error: 'Internal server error while updating camera.' });
  }
};

// 4. DELETE CAMERA
export const deleteCamera = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized user.' });
      return;
    }

    if (!id) {
      res.status(400).json({ error: 'Camera ID parameter is required.' });
      return;
    }

    const existingCamera = await prisma.camera.findFirst({
      where: { id, userId },
    });

    if (!existingCamera) {
      res.status(404).json({ error: 'Camera not found or access denied.' });
      return;
    }

    await prisma.camera.delete({
      where: { id },
    });

    // Remove live stream path from MediaMTX
    await unregisterStreamPath(id);

    res.status(200).json({
      message: 'Camera deleted successfully',
      id,
    });
  } catch (error) {
    console.error('Delete Camera Error:', error);
    res.status(500).json({ error: 'Internal server error while deleting camera.' });
  }
};