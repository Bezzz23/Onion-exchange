import Router from '@koa/router';
import wallets from './wallets';
import currencies from './currencies';

const router = new Router();

router.use('/wallets', wallets.routes());
router.use('/currencies', currencies.routes());

export default router;