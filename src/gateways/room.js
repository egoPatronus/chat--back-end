const Room = require('../services/room');

module.exports = function RoomGateway(_ws, socket) {
  async function newMessage(payload, response) {
    const { _id: sender } = socket?.user ?? '';
    const { content, roomId, recipient } = payload ?? '';
    try {
      const message = await Room().newMessage(content, sender);
      await Room().updateChatHistory(roomId, message);
      socket.to(recipient).emit('room:receive-message', { message, roomId });
      response(message);
    } catch (error) {
      socket.emit('generic_error', error);
    }
  }

  async function openRoom(usersInRoom, response) {
    try {
      const room = await Room().createRoomIfItDoesNotExist(usersInRoom);
      const { users } = room ?? [];
      const { _id: senderId } = socket.user ?? '';
      const recipient = users.filter(
        ({ _id: userId }) => userId.toString() !== senderId.toString(),
      );
      room.users = { ...recipient[0] };
      response(room);
    } catch (error) {
      socket.emit('generic_error', error);
    }
  }

  socket.on('room:new-message', newMessage);
  socket.on('room:find-room', openRoom);
};
