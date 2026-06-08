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
    onDelete: 'SET NULL'
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  }
}

class Order extends Model {
  static associate(models) {
    this.belongsTo(models.Customer, {
      as: 'customer',
      foreignKey: 'customerId'
    })
  }

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
