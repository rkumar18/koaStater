const Koa = require('koa');
const niv = require('node-input-validator');
const bodyparser = require('koa-bodyparser');
require('dotenv').config();
const Router = require('koa-router');
const Connection = require('./connect');
const { Customer, Product } = require('../apis/routes');

const app = new Koa();
Connection();
app.use(niv.koa());
app.use(bodyparser());
const customerAPIs = Router().use(Customer.routes());
app.use(customerAPIs.routes())
const productAPIs = Router().use(Product.routes());
app.use(productAPIs.routes()).use(productAPIs.allowedMethods());
// eslint-disable-next-line no-console
console.log(`Server start listen at: ${process.env.PORT}`);
app.listen(process.env.PORT);
