const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { Server } = require('socket.io');
const { createServer } = require('http');

const Logger = require('./config/logging');
const morgan = require('./config/morgan');
const jwtVerify = require('./middlewares/jwt-verify');
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

  const httpServer = createServer(app);
  const ws = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  ws.use(jwtVerify);
  ws.on('connection', (socket) => console.log(`${socket.id} connected`));
  httpServer.listen(PORT, () => Logger.debug(`[EXPRESS] Running on port ${PORT}`));
}

bootServer();
