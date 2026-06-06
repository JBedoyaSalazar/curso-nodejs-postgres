'use strict';

import { CustomerSchema, CUSTOMER_TABLE } from "../models/customers.model.js";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface) {
    await queryInterface.createTable(CUSTOMER_TABLE, CustomerSchema)
  },

  async down (queryInterface) {
    await queryInterface.dropTable(CUSTOMER_TABLE)
  }
};
