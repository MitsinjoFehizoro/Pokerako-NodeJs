import { Router } from 'express';
import { login, protectedRoute, signup } from '../controllers/user-controller';
import { auth } from '../auth/auth';

const router = Router();

router.post('/signup', signup);
router.post('/login', login)
router.get('/protected', auth, protectedRoute)

export default router;
