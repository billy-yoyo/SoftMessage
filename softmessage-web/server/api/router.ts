import { Router } from 'express';
import channelRouter from './channel';
import userRouter from './user';

const router = Router();

router.use('/channel', channelRouter);
router.use('/user', userRouter);

export default router;