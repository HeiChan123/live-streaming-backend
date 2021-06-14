import express from 'express';

import { createAddress } from '../controllers/addressController';
import verifyAuth from '../middlewares/verifyAuth.js';

const router = express.Router();

// address Routes

router.post('/createAddress', verifyAuth, createAddress);

export default router;
