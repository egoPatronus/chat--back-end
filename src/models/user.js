const Mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');

const { Schema, model, models } = Mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'E-mail is a required field'],
    validate: {
      validator: (value) => isEmail(value),
      message: 'Invalid e-mail provided',
    },
  },
  username: {
    type: String,
    required: [true, 'Username is a required field'],
  },
  hash: {
    type: String,
    required: [true, 'Password is a required field'],
  },
}, {
  timestamps: true,
});

userSchema.virtual('password');

// eslint-disable-next-line consistent-return
userSchema.methods.hashPassword = async function hashPassword() {
  try {
    const SALT_ROUNDS = 10;
    const hash = await bcrypt.hash(this.password, SALT_ROUNDS);
    this.hash = hash;
  } catch (error) {
    error.name = 'ValidationError';
    throw error;
  }
};

userSchema.methods.comparePassword = async function comparePassword(password) {
  try {
    const doesPasswordMatch = await bcrypt.compare(password, this.hash);
    return doesPasswordMatch;
  } catch (error) {
    return error;
  }
};

userSchema.path('email').validate(async (email) => {
  const doesUserExists = await models.User.exists({ email });
  return !doesUserExists;
}, 'E-mail already exists');

module.exports = model('User', userSchema);
