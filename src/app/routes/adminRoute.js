import express from 'express';

import { createAdmin } from '../controllers/adminController.js';
import verifyAuth from '../middlewares/verifyAuth.js';

const router = express.Router();

// admin Routes

router.post('/createAdmin', verifyAuth, createAdmin);
export default router;