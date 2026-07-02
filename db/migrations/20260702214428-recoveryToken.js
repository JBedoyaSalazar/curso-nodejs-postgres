'use strict';
import { USER_TABLE } from '../models/user.model.js';

/** @type {import('sequelize-cli').Migration} */
export default {
  /**
   * Adds the nullable recovery token column used by the password recovery flow.
   *
   * @param {import('sequelize').QueryInterface} queryInterface - Sequelize migration query interface.
   * @param {typeof import('sequelize')} Sequelize - Sequelize data types namespace.
   * @returns {Promise<void>}
   */
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(USER_TABLE, 'recovery_token', {
      allowNull: true,
      type: Sequelize.STRING
    });
  },

  /**
   * Removes the recovery token column from the users table.
   *
   * @param {import('sequelize').QueryInterface} queryInterface - Sequelize migration query interface.
   * @returns {Promise<void>}
   */
  async down (queryInterface) {
    await queryInterface.removeColumn(USER_TABLE, 'recovery_token');
  }
};
