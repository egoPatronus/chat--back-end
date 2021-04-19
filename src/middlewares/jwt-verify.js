const jwt = require('jsonwebtoken');

module.exports = async function verifyJWT(socket, next) {
  const { token } = socket.handshake.auth;

  const validateToken = new Promise((resolve, reject) => {
    jwt.verify(token, process.env.API_SECRET, (error, decoded) => {
      if (error) reject(error);
      resolve(decoded);
    });
  });

  try {
    const payload = await validateToken;
    // eslint-disable-next-line no-param-reassign
    socket.user = payload;
    console.log(payload);
    next();
  } catch (error) {
    next(error);
  }
};
