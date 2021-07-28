const Router = require('koa-router')
const formidable = require('formidable')
const { Customer } = require('../controller');
const { verifyToken } = require('../../middlewares');
const { Upload } = require('../../utilities')

const router = new Router();

const multipart = async (ctx, next) => {
    //@ts-ignore
    var form = new formidable({ multiples: true })
    form.keepExtensions = true;
		await new Promise((resolve, reject) => {
    form.parse(ctx.req, (err, fields, files) => {
			if (err) {
				reject(err);
				return;
			}
			ctx.set('Content-Type', 'application/json');
        ctx.status = 200;
        ctx.state = { fields, files };
        ctx.body = JSON.stringify(ctx.state, null, 2);
        resolve();
      });
		});
			await next();
			return;
  };


/**
 * @onboardUser
 */
router.post('/signup', Customer.signUp);
router.post('/login', Customer.login);
router.get('/profile', verifyToken(), Customer.getProfile);
router.post('/profile', verifyToken(), multipart, Customer.updateProfile);
router.post('/token', verifyToken(), Customer.getToken);

module.exports = router;
