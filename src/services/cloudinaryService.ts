import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';

if (env.CLOUDINARY_URL) {
  // Cloudinary automatically parses the CLOUDINARY_URL environment variable
  cloudinary.config(true);
}

export const uploadToCloudinary = async (buffer: Buffer): Promise<string | null> => {
  if (!env.CLOUDINARY_URL) {
    console.warn('Cloudinary URL not configured, skipping Cloudinary upload.');
    return null;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'image-microservice' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          resolve(null); // Resolve with null to allow fallback
        } else {
          resolve(result?.secure_url || null);
        }
      }
    );

    uploadStream.end(buffer);
  });
};
