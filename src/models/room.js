const Mongoose = require('mongoose');

const { Schema, model } = Mongoose;
const { ObjectId } = Schema.Types;

const roomSchema = new Schema({
  users: [{
    tipe: ObjectId,
    ref: 'User',
    required: true,
  }],
  history: [{
    type: ObjectId,
    ref: 'Messsage',
    required: true,
    default: [],
  }],
}, {
  timestamps: true,
});

module.exports = model('User', roomSchema);
