import { CronJob } from 'cron';
import getBalanceByAddress from './balance';
import { subscribeBinanceRates } from './rates';

const fifteenSeconds = '*/15 * * * * *';

subscribeBinanceRates({
  updateTime: 15000
});

const cron = new CronJob(fifteenSeconds, async () => {
  await getBalanceByAddress();
  console.error('Balances received');
});

export { cron };