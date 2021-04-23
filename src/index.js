const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { Server } = require('socket.io');
const { createServer } = require('http');

const Logger = require('./config/logging');
const morgan = require('./config/morgan');
const wsGateway = require('./ws-gateway');
const jwtValidate = require('./middlewares/jwt-validate');
const joinWsRoom = require('./middlewares/join-ws-room');
const databaseConnection = require('./config/database-connection');
const router = require('./router');

const PORT = process.env.PORT || 8000;

function bootServer() {
  dotenv.config();
  databaseConnection();
  const app = express();
  app.use(morgan);
  app.use(express.json());
  app.use(cors({ origin: 'http://localhost:3000' }));
  app.use('/', router);

  const httpServer = createServer(app);
  const ws = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
    },
  });

  ws.use(jwtValidate);
  ws.use(joinWsRoom);
  ws.on('connection', (socket) => wsGateway(ws, socket));
  httpServer.listen(PORT, () => Logger.debug(`[EXPRESS] Running on port ${PORT}`));
}

bootServer();
