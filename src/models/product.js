const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  type: {
    type: String,
    enum: ['Electronic', 'Cloth'],
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  addedBy: {
    type: mongoose.Types.ObjectId,
    ref: 'customer',
  },
});

// eslint-disable-next-line func-names
Schema.static.findActive = function () {
  return this.where({ isDeleted: false }).populate('addedBy', 'firstName lastName email');
};

const Product = mongoose.model('product', Schema);
module.exports = Product;
