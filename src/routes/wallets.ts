import { wallet } from '../controller';
import Router from '@koa/router';

const router = new Router();

router.get('/', wallet.getWallets);
router.post('/', wallet.createWallet);

export default router;