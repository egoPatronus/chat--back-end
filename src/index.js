const express = require('express');
const dotenv = require('dotenv');
const { Server } = require('http');

const Logger = require('./config/logging');
const morgan = require('./config/morgan');

const PORT = process.env.PORT || 8000;

function bootServer() {
  dotenv.config();
  const app = express();
  app.use(morgan);
  app.use(express.json());

  const server = new Server(app);
  server.listen(PORT, () => Logger.debug(`[EXPRESS] Running on port ${PORT}`));
}

bootServer();
