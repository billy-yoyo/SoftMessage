const { Router } = require('express');
const userRouter = require('./routes/user');
const channelRouter = require('./routes/channel');
const auth = require('./authenticate');

const router = Router();

router.use(auth.authenticate);
router.use('/channel', channelRouter);
router.use('/user', userRouter);

module.exports = router;