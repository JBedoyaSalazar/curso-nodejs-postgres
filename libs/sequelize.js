import { Sequelize } from "sequelize";
import { config } from '../config/config.js';
import { setupModels } from "../db/models/index.js";

const USER = encodeURIComponent(config.dbUser)
const PASSWORD = encodeURIComponent(config.dbPassword)
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`

/**
 * Sequelize instance configured for the PostgreSQL database described by environment variables.
 *
 * The models are registered immediately after the connection object is created, so services can
 * import `models` from this module without initializing associations themselves.
 */
export const sequelize = new Sequelize(URI, {
  dialect: 'postgres',
  logging: console.log
})

setupModels(sequelize)

/**
 * Registered Sequelize models exposed for service-layer database operations.
 */
export const models = sequelize.models;
