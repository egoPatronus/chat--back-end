// const User = require('../services/user');

module.exports = function UserGateway(ws, socket) {
  async function getProfileData() {
    const { user } = socket;

    // const contacts = User().contacts(user.email);

    const profileData = {
      user,
    };

    socket.emit('user:get-profile', profileData);
  }

  getProfileData();
};
