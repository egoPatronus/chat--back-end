const Logger = require('./config/logging');
const UserGateway = require('./gateways/user');

module.exports = function webSocketsGateway(ws, socket) {
  Logger.debug(`[SOCKET.IO] user ${socket.user.email} connected`);

  UserGateway(ws, socket);
};
