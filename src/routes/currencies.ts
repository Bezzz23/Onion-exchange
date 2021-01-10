import { currency } from '../controller';
import Router from '@koa/router';

const router = new Router();

router.get('/', currency.getCurrencies);
router.post('/', currency.createCurrency);

export default router;