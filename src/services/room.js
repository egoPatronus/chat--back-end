const Message = require('../models/message');
const Room = require('../models/room');

module.exports = function RoomServices() {
  async function newMessage(content, sender) {
    const message = new Message({ content, sender });
    await message.save();
    return message;
  }

  async function getRooms(user) {
    const rooms = await Room.find({ users: { $in: [user] } }, 'users history').lean().exec();
    return rooms;
  }

  async function createRoomIfItDoesNotExist(usersInRoom) {
    const room = await Room.findOne({
      $and: [
        { users: { $all: usersInRoom } },
        { users: { $size: 2 } },
      ],
    }, 'users history').lean().exec();
    if (room) {
      return room;
    }

    const newRoom = new Room({ users: usersInRoom });
    await newRoom.save();

    const { _id, users, history } = newRoom.toObject();
    return { _id, users, history };
  }

  async function updateChatHistory(roomId, { _id: messageId }) {
    const room = await Room.findById(roomId).exec();
    let { history } = room;
    const pushNewMessage = history.push(messageId);
    history = pushNewMessage;
    await room.save();

    return room;
  }

  return {
    newMessage,
    createRoomIfItDoesNotExist,
    getRooms,
    updateChatHistory,
  };
};
