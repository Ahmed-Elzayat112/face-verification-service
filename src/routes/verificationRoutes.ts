import { Router } from 'express';
import multer from 'multer';
import { encode, compare } from '../controllers/verificationController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory

router.post('/encode', upload.single('image'), encode);
router.post('/compare', upload.single('image'), compare);

export default router;