const express = require('express');

const userController = require('./controllers/user');

const router = express.Router();

router.use('/user', userController());

module.exports = router;
