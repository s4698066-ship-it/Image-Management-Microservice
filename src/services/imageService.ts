import { pool } from '../config/db';
import { generateHash } from '../utils/hash';
import { uploadToCloudinary } from './cloudinaryService';
import { uploadToImgBB } from './imgbbService';

export interface ImageRecord {
  id: number;
  hash: string;
  cloudinary_url: string | null;
  imgbb_url: string | null;
  created_at: Date;
}

export const processImageUpload = async (buffer: Buffer): Promise<ImageRecord> => {
  const hash = generateHash(buffer);

  // Check if image already exists
  const existingResult = await pool.query('SELECT * FROM images WHERE hash = $1', [hash]);
  if (existingResult.rows.length > 0) {
    return existingResult.rows[0];
  }

  // Upload concurrently
  const [cloudinaryUrl, imgbbUrl] = await Promise.all([
    uploadToCloudinary(buffer),
    uploadToImgBB(buffer),
  ]);

  if (!cloudinaryUrl && !imgbbUrl) {
    throw new Error('Failed to upload image to any storage provider.');
  }

  // Save to database
  const insertResult = await pool.query(
    'INSERT INTO images (hash, cloudinary_url, imgbb_url) VALUES ($1, $2, $3) RETURNING *',
    [hash, cloudinaryUrl, imgbbUrl]
  );

  return insertResult.rows[0];
};

export const getImageByHash = async (hash: string): Promise<ImageRecord | null> => {
  const result = await pool.query('SELECT * FROM images WHERE hash = $1', [hash]);
  return result.rows.length > 0 ? result.rows[0] : null;
};
