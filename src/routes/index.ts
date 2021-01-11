import Router from '@koa/router';
import wallets from './wallets';
import currencies from './currencies';
import exchanges from './exchangeRates';

const router = new Router();

router.use('/wallets', wallets.routes());
router.use('/currencies', currencies.routes());
router.use('/exchanges', exchanges.routes());

export default router;