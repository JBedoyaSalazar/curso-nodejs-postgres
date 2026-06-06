'use strict';

import { CUSTOMER_TABLE } from "../models/customers.model.js";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    await queryInterface.addConstraint(CUSTOMER_TABLE, {
      fields: ['user_id'],
      type: 'unique',
      name: 'customers_user_id_unique'
    });
  },

  async down(queryInterface) {
  await queryInterface.removeConstraint(
    CUSTOMER_TABLE,
    'customers_user_id_unique'
  );
}
};
