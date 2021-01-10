import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import cors from '@koa/cors';
import winston from 'winston';
import { createConnection } from 'typeorm';
import 'reflect-metadata';

import { logger } from './logger';
import { config } from './config';
import routes from './routes';

import { cron } from './crons/cron';

createConnection({
  type: 'postgres',
  url: config.databaseUrl,
  synchronize: true,
  logging: false,
  entities: config.dbEntitiesPath,
  migrations: ['migration/*.ts'],
}).then(async () => {

  const app = new Koa();

  app.use(helmet());
  app.use(cors());
  app.use(logger(winston));
  app.use(bodyParser());
  app.use(routes.routes());
  cron.start();
  app.listen(config.port);

  console.log(`Server running on port ${config.port}`);

}).catch((error: string) => console.log('TypeORM connection error: ', error));