import { Model, DataTypes, Sequelize } from "sequelize";
import { CUSTOMER_TABLE } from './customers.model.js';

const ORDER_TABLE = "orders"

/** @type {import('sequelize').ModelAttributes} */
const OrderSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  customerId: {
    allowNull: false,
    field: 'customer_id',
    type: DataTypes.INTEGER,
    references: {
      model: CUSTOMER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  },
  total: {
    type: DataTypes.VIRTUAL,
    /**
     * Calculates the order total from loaded items and their pivot-table amounts.
     *
     * @returns {number} Sum of item price multiplied by the order amount, or 0 when items are not loaded.
     */
    get() {
    if (!this.items) return 0;

    return this.items.reduce((total, item) => {
        return total + item.price * item.OrderProduct.amount;
    }, 0);
}
  }
}

/**
 * Sequelize model for customer orders.
 */
class Order extends Model {
  /**
   * Associates each order with a customer and its product items.
   *
   * @param {Record<string, typeof Model>} models - Registered Sequelize models.
   * @returns {void}
   */
  static associate(models) {
    this.belongsTo(models.Customer, {
      as: 'customer',
      foreignKey: 'customerId'
    })
    this.belongsToMany(models.Product, {
      as: 'items',
      through: models.OrderProduct,
      foreignKey: 'orderId',
      otherKey: 'productId'
    })
  }

  /**
   * Returns Sequelize metadata for the orders table.
   *
   * @param {import('sequelize').Sequelize} sequelize - Sequelize connection instance.
   * @returns {import('sequelize').ModelOptions} Model configuration.
   */
  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_TABLE,
      modelName: 'Order',
      timestamps: false,
    };
  }
}


export { ORDER_TABLE, OrderSchema, Order };
