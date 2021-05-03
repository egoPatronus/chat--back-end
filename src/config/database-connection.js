const mongoose = require('mongoose');

const { connect, connection } = mongoose;
const Logger = require('./logging');

module.exports = function databaseConnection() {
  connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  }).catch(({ message }) => Logger.error(`[MONGODB]: ${message}`));

  const database = connection;
  database.on('error', ({ message }) => Logger.error(`[MONGODB]: ${message}`));
  database.once('open', () => {
    Logger.debug('[MONGODB] Successfully connected');
  });
};
