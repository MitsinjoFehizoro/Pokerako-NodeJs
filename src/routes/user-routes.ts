import { Router } from 'express';
import { login, logout, protectedRoute, refreshAccessToken, signup } from '../controllers/user-controller';
import { auth } from '../auth/auth';

const router = Router();

router.post('/signup', signup);
router.post('/login', login)
router.post('/refresh-token', refreshAccessToken)
router.post('/logout', auth, logout)
router.get('/protected', auth, protectedRoute)

export default router;
