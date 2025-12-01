import { Router } from 'express';
import { uploadDrugImage, handleUploadDrugImage, deleteDrugImage } from '../controllers/uploadController.js';

const router = Router();

// Upload drug image
router.post('/drug-image', uploadDrugImage, handleUploadDrugImage);

// Delete drug image
router.delete('/drug-image/:filename', deleteDrugImage);

export default router;