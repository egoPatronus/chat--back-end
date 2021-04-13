const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { Server } = require('http');

const Logger = require('./config/logging');
const morgan = require('./config/morgan');
const databaseConnection = require('./config/database-connection');
const router = require('./router');

const PORT = process.env.PORT || 8000;

function bootServer() {
  dotenv.config();
  databaseConnection();
  const app = express();
  app.use(morgan);
  app.use(express.json());
  app.use(cors({ origin: '*' }));
  app.use('/', router);

  const server = new Server(app);
  server.listen(PORT, () => Logger.debug(`[EXPRESS] Running on port ${PORT}`));
}

bootServer();
