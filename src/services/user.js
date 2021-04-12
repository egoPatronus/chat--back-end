const User = require('../models/user');

module.exports = function UserService() {
  async function create(email, username, password) {
    const user = new User({ email, username, password });
    await user.hashPassword();
    await user.save();
    return user;
  }

  async function validate(email, password) {
    const user = await User.findOne({ email }, 'email username hash').exec();
    const error = new Error('User does not exist');
    error.name = 'ValidationError';

    if (user) {
      const doesPasswordMatch = await user.comparePassword(password);
      if (doesPasswordMatch) {
        const { username, email: userEmail } = user;
        return { username, userEmail };
      }
      error.message = 'Password does not match';
      throw error;
    }
    throw error;
  }

  return {
    create,
    validate,
  };
};
