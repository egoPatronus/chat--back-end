const Mongoose = require('mongoose');

const { Schema, model } = Mongoose;
const { ObjectId } = Schema.Types;

const messageSchema = new Schema({
  content: {
    type: String,
    required: [true, 'The message should have a body'],
  },
  sender: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

messageSchema.post('save', (doc, next) => {
  doc
    .populate({ path: 'sender', select: 'username email' })
    .execPopulate()
    .then(() => next());
});

module.exports = model('Message', messageSchema);
