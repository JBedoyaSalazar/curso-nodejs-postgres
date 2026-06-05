import pg from 'pg';
import { config } from '../config/config.js';
const { Pool } = pg;

const USER = encodeURIComponent(config.dbUser)
const PASSWORD = encodeURIComponent(config.dbPassword)
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`

let pool;

if (!pool) {
  pool = new Pool({
      connectionString: URI
  });
}

export default pool;
