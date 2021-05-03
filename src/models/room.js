const Mongoose = require('mongoose');

const { Schema, model, Types } = Mongoose;
const { ObjectId } = Types;

const roomSchema = new Schema({
  users: [{
    type: ObjectId,
    ref: 'User',
    required: true,
  }],
  history: [{
    type: ObjectId,
    ref: 'Message',
    required: true,
    default: [],
  }],
}, {
  timestamps: true,
});

function populateFields() {
  this
    .populate({ path: 'users', select: 'username email' })
    .populate({
      path: 'history',
      select: 'sender content updatedAt',
      populate: {
        path: 'sender',
        select: 'username email',
      },
    });
}

roomSchema.post('save', (doc, next) => {
  doc
    .populate({ path: 'users', select: 'username email' })
    .populate({
      path: 'history',
      select: 'sender content updatedAt',
      populate: {
        path: 'sender',
        select: 'username email',
      },
    })
    .execPopulate()
    .then(() => next());
});

roomSchema.pre('findOne', populateFields);

roomSchema.pre('find', populateFields);

module.exports = model('Room', roomSchema);
