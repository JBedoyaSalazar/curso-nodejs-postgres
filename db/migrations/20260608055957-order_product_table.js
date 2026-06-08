'use strict';

import { ORDER_PRODUCT_TABLE, OrderProcductSchema} from './../models/order-product.model.js'

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface) {
    await queryInterface.createTable(ORDER_PRODUCT_TABLE, OrderProcductSchema)
  },

  async down (queryInterface) {
    await queryInterface.dropTable(ORDER_PRODUCT_TABLE)
  }
};
