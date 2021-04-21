const jwt = require('jsonwebtoken');

module.exports = async function jwtValidate(socket, next) {
  const { token } = socket?.handshake?.auth;

  const validateToken = new Promise((resolve, reject) => {
    jwt.verify(token, process.env.API_SECRET, (error, decoded) => {
      if (error) reject(error);
      const { payload } = decoded;
      resolve(payload);
    });
  });

  try {
    const payload = await validateToken;
    // eslint-disable-next-line no-param-reassign
    socket.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};
