import Router from '@koa/router';
import wallets from './wallets';

const router = new Router();

router.use('/wallets', wallets.routes());

export default router;