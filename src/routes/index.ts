import Router from 'express';
import { authRouter, messageRouter, userRouter } from '../controllers';
import { authenticateToken } from '../middlewares';

const router = Router();


router.use('/auth', authRouter);
router.use('/users', authenticateToken, userRouter);
router.use('/messages', authenticateToken,  messageRouter);


export default router;