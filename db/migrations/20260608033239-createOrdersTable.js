'use strict';
import { OrderSchema, ORDER_TABLE } from "../models/order.model.js";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface) {
    await queryInterface.createTable(ORDER_TABLE, OrderSchema)
  },

  async down (queryInterface) {
    await queryInterface.dropTable(ORDER_TABLE)
  }
};
