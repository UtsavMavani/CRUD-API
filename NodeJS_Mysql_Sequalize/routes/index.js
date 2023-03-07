const router = require('express').Router();

const userRouter = require('./user');
const bookRouter = require('./book');

router.use('/user', userRouter);
router.use('/api', bookRouter);

module.exports = router;