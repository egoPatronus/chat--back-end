const Message = require('../models/message');

module.exports = function RoomServices() {
  async function newMessage(content, sender) {
    const message = new Message({ content, sender });
    message.save();
    return message;
  }

  return {
    newMessage,
  };
};
