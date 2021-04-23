module.exports = function JoinRoom(socket, next) {
  const { email } = socket?.user;
  socket.join(email);
  next();
};
