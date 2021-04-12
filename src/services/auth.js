const jwt = require('jsonwebtoken');

const User = require('./user');

module.exports = function AuthService() {
  async function signJWT(payload) {
    const result = new Promise((resolve, reject) => {
      jwt.sign({ payload }, process.env.API_SECRET, (error, token) => {
        if (error) reject(error);
        resolve(token);
      });
    });

    const token = await result;
    return token;
  }

  async function login(email, password) {
    const user = await User().validate(email, password);
    const token = signJWT(user);
    return token;
  }

  return {
    login,
  };
};
