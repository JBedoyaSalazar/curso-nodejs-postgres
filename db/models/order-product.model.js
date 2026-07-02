import { Model, DataTypes, Sequelize } from "sequelize";
import { ORDER_TABLE } from "./order.model.js";
import { PRODUCT_TABLE } from "./product.model.js"

const ORDER_PRODUCT_TABLE = "orders_products"

/** @type {import('sequelize').ModelAttributes} */
const OrderProductSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  amount: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  orderId: {
    allowNull: false,
    field: 'order_id',
    type: DataTypes.INTEGER,
    references: {
      model: ORDER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },
  productId: {
    allowNull: false,
    field: 'product_id',
    type: DataTypes.INTEGER,
    references: {
      model: PRODUCT_TABLE,
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
  }
}

/**
 * Sequelize model for the join table between orders and products.
 */
class OrderProduct extends Model {
  /**
   * Reserved association hook for consistency with the other models.
   *
   * @returns {void}
   */
  static associate() {
    //
  }

  /**
   * Returns Sequelize metadata for the orders_products table.
   *
   * @param {import('sequelize').Sequelize} sequelize - Sequelize connection instance.
   * @returns {import('sequelize').ModelOptions} Model configuration.
   */
  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_PRODUCT_TABLE,
      modelName: 'OrderProduct',
      timestamps: false,
    };
  }
}


export { ORDER_PRODUCT_TABLE, OrderProductSchema, OrderProduct };
