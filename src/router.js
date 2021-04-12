const express = require('express');

const userController = require('./controllers/user');
const authController = require('./controllers/auth');

const router = express.Router();

router.use('/user', userController());
router.use('/auth', authController());

module.exports = router;
