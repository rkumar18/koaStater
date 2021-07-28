/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const { Validator } = require('node-input-validator');
const Queue = require('bull');
const nodemailer = require('nodemailer');
const { Customer } = require('../../models');
const { Password } = require('../../utilities');
const { createToken, createRefreshToken } = require('../../middlewares');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const jwt = require('jsonwebtoken')


function sendMail(email) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: 'dummy@yopmail.com',
      to: email,
      subject: 'Register Successfully',
      text: 'You have register successfully',
    };
    const mailConfig = {
      service: 'gmail',
      port: 587,
      auth: {
        user: 'rohitk.offsureit@gmail.com',
        pass: 'offsure@123',
      },
    };
    // eslint-disable-next-line no-undef
    nodemailer.createTransport(mailConfig).sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });
}

async function signUp(ctx) {
  try {
    const isExist = await Customer.findOne({ email: ctx.request.body.email });
    if (isExist) {
      ctx.status = 400;
      ctx.body = 'Email already associated with another account';
      return;
    }
    const v = new Validator(ctx.request.body, {
      email: 'required|email',
      password: 'required|minLength:8',
      firstName: 'required|maxLength:10',
      lastName: 'required|maxLength:10',
      countryCode: 'required|minLength:1',
      phone: 'required|maxLength:10',
    });

    const matched = await v.check();
    if (!matched) {
      ctx.status = 422;
      ctx.body = v.errors;
      return;
    }
    ctx.request.body.password = await Password.hash(ctx.request.body.password);
    const customer = await Customer.create(ctx.request.body);

    const sendMailQueue = new Queue('sendMail', {
      redis: {
        host: '127.0.0.1',
        port: 6379,
      },
    });
    const data = {
      email: customer.email,
    };
    const options = {
      delay: 6000,
      attempts: 2,
    };
    sendMailQueue.add(data, options);
    // eslint-disable-next-line no-return-await
    sendMailQueue.process(async (job) => await sendMail(job.data.email));
    ctx.status = 201;
    ctx.body = customer;
    return;
  } catch (error) {
    console.log(error.message);
  }
}

async function login(ctx) {
  try {
    const v = new Validator(ctx.request.body, {
      email: 'required|email',
      password: 'required|minLength:8',
    });
    const matched = await v.check();
    if (!matched) {
      ctx.status = 422;
      ctx.body = v.errors;
      return;
    }
    const customer = await Customer.findOne({ email: ctx.request.body.email }).lean();
    if (!customer) {
      ctx.status = 400;
      ctx.body = 'Email not exist';
      return;
    }
    const validatePassword = await Password.verify(ctx.request.body.password, customer.password);
    if (!validatePassword) {
      // ctx.throw = (400,'Password not match');
      ctx.status = 400;
      ctx.throw = 'Password not match';
      return;
    }
    const authToken = createToken({ id: customer._id , iss: Date.now(), exp: Date.now() + 300});
    const refreshToken = createRefreshToken({ id: customer._id, iss: Date.now(), exp: Date.now() + 604800000 });
    delete customer.password;
    customer.authToken = authToken;
    customer.refreshToken = refreshToken;
    ctx.status = 200;
    ctx.body = customer;
  } catch (error) {
    console.log(error.message);
  }
}

async function getProfile(ctx) {
  try {
    const customer = await Customer.findById(ctx.request.customer._id, { password: 0 });
    if (!customer) {
      throw Error('No customer found');
    }
    ctx.status = 200;
    ctx.body = customer;
    return;
  } catch (error) {
    console.log(error.message);
  }
}

async function updateProfile(ctx) {
  try {
    let tempPath = ctx.state.files.avatar.path;
    const mediaPath = process.env.MEDIA_PATH;
    let dir = process.cwd();
    dir = dir + mediaPath;
    // fs.copyFileSync(tempPath, dir);
    // dir = path.normalize(dir).replace(/^(\.\.[\/\\])+/, '');
    // console.log('dir-->', dir);
    sharp(tempPath)
    .resize(250,250)
    .toFile(dir+"output2.png", async(err, resizedImage) => {
      fs.unlink(tempPath, () => {} );
        if(err) return console.log('error during image resize');
        const customer = await Customer.findByIdAndUpdate(ctx.request.customer._id, {avatar: resizedImage },{ new: true });
        if (!customer) {
          throw Error('No customer found');
        }
        ctx.status = 200;
        ctx.body = customer;
        return;
      })
  } catch (error) {
    console.log(error.message);
  }
}


async function getToken(ctx) {
  try {
    
    const isVerify = jwt.verify(ctx.get('refreshToken'), process.env.JWT_REFRESH_SECRET);
    if (!isVerify) throw Error('Invalid Token');
    const newToken = jwt.sign({id: isVerify.id}, process.env.JWT_SECRET,{ expiresIn: '5m' });
    ctx.status = 200;
    ctx.body = {newToken};
    return;
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = { signUp, login, getProfile, updateProfile, getToken };
