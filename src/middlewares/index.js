const jwt = require('jsonwebtoken');
const { Customer } = require('../models');

function createToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET);
}

function createRefreshToken(payload){
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET);
}


function verifyToken() {
  return async (ctx, next) => {
    const isVerify = jwt.verify(ctx.get('authToken'), process.env.JWT_SECRET);
    const isRefreshVerify = jwt.verify(ctx.get('refreshToken'), process.env.JWT_REFRESH_SECRET);
    if (!isVerify) throw Error('No Token');
    var current_time = Date.now();
	  if (isVerify.exp < current_time) {
      if(isRefreshVerify.exp < current_time){
        ctx.status = 401;
        ctx.body = 'Token Expire';
        return;
      }
    const newToken = jwt.sign({id: isRefreshVerify.id, iss: Date.now(), exp: Date.now() + 30000}, process.env.JWT_SECRET);
    ctx.status = 200;
    ctx.body = newToken;
    return;
    }
    const customer = await Customer.findById(isVerify.id).lean();
    ctx.request.customer = customer;
    // eslint-disable-next-line no-return-await
    return await next();
  };
}

module.exports = { createToken, verifyToken, createRefreshToken};
