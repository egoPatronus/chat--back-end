const User = require('../models/user');

module.exports = function UserService() {
  async function create(email, username, password) {
    const user = new User({ email, username, password });
    await user.hashPassword();
    await user.save();
    return user;
  }

  // async function contacts(email) {
  //   try {
  //     const contacts = await User.find({ email: { $nin: [email] } }).exec();
  //     return null;
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  async function validate(userEmail, password) {
    const user = await User.findOne({ email: userEmail }, 'email username hash').exec();
    const error = new Error('User does not exist');
    error.name = 'ValidationError';

    if (user) {
      const doesPasswordMatch = await user.comparePassword(password);
      if (doesPasswordMatch) {
        const { username, email } = user;
        return { username, email };
      }
      error.message = 'Password is incorrect';
      throw error;
    }
    throw error;
  }

  return {
    create,
    validate,
    // contacts,
  };
};
