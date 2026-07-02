'use strict';
import { USER_TABLE } from '../models/user.model.js';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(USER_TABLE, 'recovery_token', {
      allowNull: true,
      type: Sequelize.STRING
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn(USER_TABLE, 'recovery_token');
  }
};
