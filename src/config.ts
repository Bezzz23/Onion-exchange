import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export interface Config {
  port: number;
  debugLogging: boolean;
  databaseUrl: string;
  dbEntitiesPath: string[];
  infuraEndpoint: string;
  binanceEndpoint: string;
}

const isDevMode = process.env.NODE_ENV == 'development';

const config: Config = {
  port: +(process.env.PORT || 3000),
  infuraEndpoint: 'https://ropsten.infura.io/v3/e75916500a094970b9851d37c3c198ad',
  binanceEndpoint: 'wss://stream.binance.com:9443/ws',
  debugLogging: isDevMode,
  databaseUrl: process.env.DATABASE_URL || 'postgres://orion:orion@localhost:5432/orion',
  dbEntitiesPath: [
    ...isDevMode ? ['src/entity/**/*.ts'] : ['dist/entity/**/*.js'],
  ],
};

export { config };