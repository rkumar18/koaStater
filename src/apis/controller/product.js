const { Validator } = require('node-input-validator');
const { Product } = require('../../models');

async function add(ctx) {
  try {
    const v = new Validator(ctx.request.body, {
      productName: 'required',
      desc: 'required|minLength:8',
      type: 'required',
    });

    const matched = await v.check();
    if (!matched) {
      ctx.status = 422;
      ctx.body = v.errors;
      return;
    }
    // eslint-disable-next-line no-underscore-dangle
    ctx.request.body.addedBy = ctx.request.customer._id;
    const product = await Product.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = product;
    return;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error.message);
  }
}

async function get(ctx) {
  try {
    const products = await Product.find({ isDeleted: false }).populate('addedBy', 'firstName lastName email');
    if (!products) {
      throw Error('No Product found');
    }
    ctx.status = 200;
    ctx.body = products;
    return;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error.message);
  }
}

module.exports = { add, get };
