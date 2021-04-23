const Logger = require('../config/logging');
const User = require('../services/user');

module.exports = function UserGateway(_ws, socket) {
  Logger.debug(`[SOCKET.IO] user ${socket.user.email} connected`);

  function joinContactsRooms(contacts) {
    contacts?.forEach(({ email }) => {
      socket?.join(email);
    });
  }

  async function getProfileData() {
    const { user } = socket;

    try {
      const contacts = await User().contacts(user.email);
      const profileData = {
        user,
        contacts,
      };

      joinContactsRooms(contacts);

      socket.emit('user:get-profile', profileData);
    } catch (error) {
      socket.emit('generic_error', 'Something went wrong! Try again later.');
    }
  }

  getProfileData();
};
