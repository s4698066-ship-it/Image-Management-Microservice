import { Router } from 'express';
import { uploadImage, getImageMetadata } from '../controllers/imageController';

const router = Router();

router.post('/upload', uploadImage);
router.get('/images/:hash', getImageMetadata);

export default router;
