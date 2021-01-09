import { CronJob } from 'cron';

const fifteenSeconds = '0/15 * * * *';

const cron = new CronJob(fifteenSeconds, () => {
  console.log('CronJOB Every 15 seconds');
});

export { cron };