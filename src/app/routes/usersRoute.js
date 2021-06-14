import express from 'express';

import { register, login } from '../controllers/usersController';

const router = express.Router();

// users Routes

router.post('/auth/signup', register);
router.post('/auth/signin', login);

export default router;
