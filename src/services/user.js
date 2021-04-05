const User = require('../models/user');

module.exports = function UserService() {
  async function create(email, username, password) {
    const user = new User({ email, username, password });
    await user.hashPassword();
    await user.save();
    return user;
  }

  return {
    create,
  };
};
