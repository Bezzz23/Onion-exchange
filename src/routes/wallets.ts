import { wallet } from '../controller';
import Router from '@koa/router';

const router = new Router();

router.get('/', wallet.getWallets);
router.post('/', wallet.createWallet);
router.delete('/:id', wallet.deleteWallet);

export default router;