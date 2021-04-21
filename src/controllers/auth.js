const express = require('express');

const Logger = require('../config/logging');
const AuthService = require('../services/auth');

module.exports = function AuthController() {
  const router = express.Router();

  router.post('/login', async (request, response) => {
    const { email, password } = request.body;
    try {
      const jwt = await AuthService().login(email, password);
      response.status(200).send(jwt);
    } catch (error) {
      const { name, message } = error;
      if (name === 'ValidationError') {
        response.status(401).send(error.message);
      } else {
        Logger.error(`[AUTH] ${name} - ${message}`);
        response.status(503).send('Something went wrong! Try again later...');
      }
    }
  });

  return router;
};
