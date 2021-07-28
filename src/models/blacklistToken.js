const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  expireAt: {
    type: Date,
    required: true
  }
});

const Token = mongoose.model('blacklistToken', Schema);
module.exports = Token;
