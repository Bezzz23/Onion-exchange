import { CronJob } from 'cron';
import getBalanceByAddress from './balance';
import BinanceRates from './rates';

const binanceRates = new BinanceRates(15000, 10000);
const fifteenSeconds = '*/15 * * * * *';

binanceRates.subscribe();

const cron = new CronJob(fifteenSeconds, async () => {
  await getBalanceByAddress();
  console.error('Balances received');
});

export { cron };