'use strict';
import { UserSchema, USER_TABLE } from "../models/user.model.js";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface) {
    await queryInterface.createTable(USER_TABLE, UserSchema)
  },

  async down (queryInterface) {
    await queryInterface.dropTable(USER_TABLE)
  }
};
