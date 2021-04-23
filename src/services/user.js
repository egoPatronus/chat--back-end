const User = require('../models/user');
const Logger = require('../config/logging');

module.exports = function UserService() {
  async function create(email, username, password) {
    const user = new User({ email, username, password });
    await user.hashPassword();
    await user.save();
    return user;
  }

  async function contacts(email) {
    try {
      const userContacts = await User.find({ email: { $nin: [email] } }, 'username email').exec();
      return userContacts;
    } catch (error) {
      const { name, message } = error;
      Logger.error(`[USER] ${name} - ${message}`);
      throw error;
    }
  }

  async function validate(userEmail, password) {
    const user = await User.findOne({ email: userEmail }, 'email username hash').exec();
    const error = new Error('User does not exist');
    error.name = 'ValidationError';

    if (user) {
      const doesPasswordMatch = await user.comparePassword(password);
      if (doesPasswordMatch) {
        const { username, email, _id: id } = user;
        return { username, email, id };
      }
      error.message = 'Password is incorrect';
      throw error;
    }
    throw error;
  }

  return {
    create,
    validate,
    contacts,
  };
};
