const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  avatar: {
    type: String
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    // select: false
  },
  countryCode: {
    type: Number,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Customer = mongoose.model('customer', Schema);
module.exports = Customer;
