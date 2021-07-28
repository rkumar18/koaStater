const Router = require('koa-router');
const { Product } = require('../controller');
const { verifyToken } = require('../../middlewares');

const router = new Router();
/**
 * @Product
 */
router.post('/product', verifyToken(), Product.add);
router.get('/product', Product.get);
// router.delete('/product', verifyToken(), Product.delete);

module.exports = router;
