const express = require('express');

const User = require('../services/user');
const Logger = require('../config/logging');

module.exports = function UserController() {
  const router = express.Router();

  router.post('/create', async (request, response) => {
    const { email, username, password } = request.body;

    try {
      await User().create(email, username, password);
      response.sendStatus(201);
    } catch (error) {
      const { name, message } = error;
      switch (name) {
        case 'ValidationError':
          response.status(400).send(message);
          break;
        default:
          Logger.error(`[USER]: ${name} - ${message}`);
          response.sendStatus(503);
          break;
      }
    }
  });

  return router;
};
