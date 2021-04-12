const express = require('express');

const Logger = require('../config/logging');
const AuthService = require('../services/auth');

module.exports = function AuthController() {
  const router = express.Router();

  router.post('/login', async (request, response) => {
    const { email, password } = request.body;
    try {
      const jwt = await AuthService().login(email, password);
      response.send(jwt);
    } catch (error) {
      if (error.name === 'ValidationError') {
        response.status(401).send(error.message);
      } else {
        Logger.error(error);
        response.sendStatus(503);
      }
    }
  });

  return router;
};
