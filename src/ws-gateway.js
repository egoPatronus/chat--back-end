const UserGateway = require('./gateways/user');
const RoomGateway = require('./gateways/room');

module.exports = function webSocketsGateway(ws, socket) {
  UserGateway(ws, socket);
  RoomGateway(ws, socket);
};
