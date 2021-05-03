/* eslint-disable no-underscore-dangle */
const Logger = require('../config/logging');
const User = require('../services/user');
const Room = require('../services/room');

module.exports = function UserGateway(_ws, socket) {
  Logger.debug(`[SOCKET.IO] user ${socket.user.email} connected`);

  function joinContactsRooms(contacts) {
    contacts?.forEach(({ email }) => {
      socket?.join(email);
    });
  }

  function parseRecipients(rooms, senderId) {
    return rooms?.map((room) => {
      const { users } = room ?? [];
      const recipient = users.filter(
        ({ _id: userId }) => userId.toString() !== senderId.toString(),
      );
      return { ...room, users: { ...recipient[0] } };
    });
  }

  async function getProfileData() {
    const { _id: senderId, email } = socket?.user ?? '';

    try {
      const contacts = await User().contacts(email);
      const roomsData = await Room().getRooms(senderId);
      const rooms = parseRecipients(roomsData, senderId);

      const profileData = {
        user: socket.user,
        contacts,
        rooms,
      };

      joinContactsRooms(contacts);

      socket.emit('user:get-profile', profileData);
    } catch (error) {
      socket.emit('generic_error', 'Something went wrong! Try again later.');
    }
  }

  getProfileData();
};
