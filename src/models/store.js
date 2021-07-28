const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  type: {
    type: String,
    enum: ['Electronic', 'Cloth', 'Both'],
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});


const Store = mongoose.model('store', Schema);
module.exports = Store;
