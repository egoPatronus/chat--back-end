const Room = require('../services/room');

module.exports = function RoomGateway(ws, socket) {
  async function receiveMessage({ content, sender }) {
    const teste = await Room().newMessage(content, sender);
    return teste;
  }

  socket.on('new-message', receiveMessage);
};
