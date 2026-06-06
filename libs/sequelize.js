import { Sequelize } from "sequelize";
import { config } from '../config/config.js';
import { setupModels } from "../db/models/index.js";

const USER = encodeURIComponent(config.dbUser)
const PASSWORD = encodeURIComponent(config.dbPassword)
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`

export const sequelize = new Sequelize(URI, {
  dialect: 'postgres',
  logging: console.log
})

setupModels(sequelize)

export const models = sequelize.models;
