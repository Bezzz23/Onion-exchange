import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export interface Config {
  port: number;
  debugLogging: boolean;
  databaseUrl: string;
  dbEntitiesPath: string[];
}

const isDevMode = process.env.NODE_ENV == 'development';

const config: Config = {
  port: +(process.env.PORT || 3000),
  debugLogging: isDevMode,
  databaseUrl: process.env.DATABASE_URL || 'postgres://orion:orion@localhost:5432/orion',
  dbEntitiesPath: [
    ...isDevMode ? ['src/entity/**/*.ts'] : ['dist/entity/**/*.js'],
  ],
};

export { config };