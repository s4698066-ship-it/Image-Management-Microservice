import { Request, Response } from 'express';
import axios from 'axios';
import { z } from 'zod';
import { processImageUpload, getImageByHash } from '../services/imageService';
import { validateUrlForSSRF } from '../utils/ssrfProtection';

const uploadSchema = z.object({
  base64: z.string().optional(),
  url: z.string().url().optional(),
}).refine(data => data.base64 || data.url, {
  message: "Either 'base64' or 'url' must be provided",
});

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = uploadSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ error: 'Invalid request', details: validation.error.format() });
      return;
    }

    const { base64, url } = validation.data;
    let imageBuffer: Buffer;

    if (base64) {
      // Remove data URI prefix if present
      const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
      imageBuffer = Buffer.from(base64Data, 'base64');
    } else if (url) {
      const isSafe = await validateUrlForSSRF(url);
      if (!isSafe) {
        res.status(400).json({ error: 'Invalid or unsafe URL provided.' });
        return;
      }

      try {
        const response = await axios.get(url, { responseType: 'arraybuffer', maxContentLength: 10 * 1024 * 1024 }); // 10MB limit
        imageBuffer = Buffer.from(response.data, 'binary');
      } catch (error) {
        res.status(400).json({ error: 'Failed to fetch image from URL.' });
        return;
      }
    } else {
      res.status(400).json({ error: 'No image data provided.' });
      return;
    }

    const record = await processImageUpload(imageBuffer);
    res.status(201).json({ message: 'Image processed successfully', data: record });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

export const getImageMetadata = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hash } = req.params;
    if (!hash || hash.length !== 64) {
      res.status(400).json({ error: 'Invalid hash format.' });
      return;
    }

    const record = await getImageByHash(hash);
    if (!record) {
      res.status(404).json({ error: 'Image not found.' });
      return;
    }

    res.status(200).json({ data: record });
  } catch (error: any) {
    console.error('Get metadata error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
