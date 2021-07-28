/* eslint-disable no-console */
const mongoose = require('mongoose');

// eslint-disable-next-line func-names
// eslint-disable-next-line consistent-return
const connect = async function () {
  try {
    mongoose.connect(process.env.MONGODBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log('DB Connect Successfully !!');
  } catch (error) {
    return console.log('Err mongo Connection');
  }
};
module.exports = connect;
