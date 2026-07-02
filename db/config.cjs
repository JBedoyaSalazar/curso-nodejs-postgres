/**
 * Encodes a database URL segment while tolerating missing environment variables.
 *
 * @param {string|undefined} value - Environment variable value.
 * @returns {string} URL-safe value.
 */
function encode(value) {
  return encodeURIComponent(value || '');
}

/**
 * Builds a PostgreSQL connection URL for Sequelize CLI from DB_* environment variables.
 *
 * @returns {string} PostgreSQL connection URL.
 */
function buildDatabaseUrl() {
  const user = encode(process.env.DB_USER);
  const password = encode(process.env.DB_PASSWORD);
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5432';
  const database = process.env.DB_NAME || 'my_store';

  return `postgres://${user}:${password}@${host}:${port}/${database}`;
}

module.exports = {
  development: {
    url: process.env.DATABASE_URL || buildDatabaseUrl(),
    dialect: 'postgres',
  },
  production: {
    url: process.env.DATABASE_URL || buildDatabaseUrl(),
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
