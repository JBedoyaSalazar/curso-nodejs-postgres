import { config } from '../config/config.js';

const USER = encodeURIComponent(config.dbUser || '');
const PASSWORD = encodeURIComponent(config.dbPassword || '');
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

export default {
  development: {
    url: process.env.DATABASE_URL || URI,
    dialect: 'postgres',
  },
  production: {
    url: process.env.DATABASE_URL || URI,
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true'
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
    },
  },
};
