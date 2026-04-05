import axios from 'axios';
import { env } from '../config/env';

export const uploadToImgBB = async (buffer: Buffer): Promise<string | null> => {
  if (!env.IMGBB_API_KEY) {
    console.warn('ImgBB API key not configured, skipping ImgBB upload.');
    return null;
  }

  try {
    const base64Image = buffer.toString('base64');
    const formData = new URLSearchParams();
    formData.append('key', env.IMGBB_API_KEY);
    formData.append('image', base64Image);

    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.data && response.data.success) {
      return response.data.data.url;
    }
    
    return null;
  } catch (error) {
    console.error('ImgBB upload error:', error);
    return null;
  }
};
