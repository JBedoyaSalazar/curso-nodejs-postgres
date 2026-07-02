import { Model, DataTypes, Sequelize } from "sequelize";
import { USER_TABLE } from "./user.model.js";

const CUSTOMER_TABLE = "customers"

/** @type {import('sequelize').ModelAttributes} */
const CustomerSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    allowNull: false,
     type: DataTypes.STRING
  },
  lastName: {
    allowNull: false,
    type: DataTypes.STRING,
    field: 'last_name'
  },
  phone: {
    allowNull: true,
    type: DataTypes.STRING
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  },
  userId: {
    allowNull: false,
    field: 'user_id',
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: USER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  }
}

/**
 * Sequelize model for customer profiles linked to users.
 */
class Customer extends Model {
  /**
   * Associates each customer with a user and its orders.
   *
   * @param {Record<string, typeof Model>} models - Registered Sequelize models.
   * @returns {void}
   */
  static associate(models) {
      this.belongsTo(models.User, {
        as: 'user'
      })
      this.hasMany(models.Order, {
        as: 'orders',
        foreignKey: 'customerId'
      })
    }

    /**
     * Returns Sequelize metadata for the customers table.
     *
     * @param {import('sequelize').Sequelize} sequelize - Sequelize connection instance.
     * @returns {import('sequelize').ModelOptions} Model configuration.
     */
    static config(sequelize) {
      return {
        sequelize,
        tableName: CUSTOMER_TABLE,
        modelName: 'Customer',
        timestamps: false,
      };
    }
}


export { CUSTOMER_TABLE, CustomerSchema, Customer };
