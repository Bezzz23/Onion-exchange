import { CronJob } from 'cron';
import getBalanceByAddress from './balance';

const fifteenSeconds = '*/15 * * * * *';

const cron = new CronJob(fifteenSeconds, async () => {
  // await getBalanceByAddress();
  console.error('Balances received');
});

export { cron };