import { exchangeRate } from '../controller';
import Router from '@koa/router';

const router = new Router();

router.get('/', exchangeRate.getExchangeRates);
router.post('/', exchangeRate.createExchangeRate);

export default router;