'use strict';

import { USER_TABLE, UserSchema } from '../models/user.model.js';
import { CATEGORY_TABLE, CategorySchema } from '../models/category.model.js';
import { CUSTOMER_TABLE, CustomerSchema } from '../models/customers.model.js';
import { PRODUCT_TABLE, ProductSchema } from '../models/product.model.js';
import { ORDER_TABLE, OrderSchema } from '../models/order.model.js';
import { ORDER_PRODUCT_TABLE, OrderProductSchema } from '../models/order-product.model.js';

/** @type {import('sequelize-cli').Migration} */
export default {

  async up(queryInterface) {

    await queryInterface.createTable(
      USER_TABLE,
      UserSchema
    );

    await queryInterface.createTable(
      CATEGORY_TABLE,
      CategorySchema
    );

    await queryInterface.createTable(
      CUSTOMER_TABLE,
      CustomerSchema
    );

    await queryInterface.createTable(
      PRODUCT_TABLE,
      ProductSchema
    );

    await queryInterface.createTable( ORDER_TABLE,
      {
        id: OrderSchema.id,
        customerId: OrderSchema.customerId,
        createdAt: OrderSchema.createdAt
      }
    );


    await queryInterface.createTable(
      ORDER_PRODUCT_TABLE,
      OrderProductSchema
    );

  },

  async down(queryInterface) {

    await queryInterface.dropTable(ORDER_PRODUCT_TABLE);

    await queryInterface.dropTable(ORDER_TABLE);

    await queryInterface.dropTable(PRODUCT_TABLE);

    await queryInterface.dropTable(CUSTOMER_TABLE);

    await queryInterface.dropTable(CATEGORY_TABLE);

    await queryInterface.dropTable(USER_TABLE);

  }

};
