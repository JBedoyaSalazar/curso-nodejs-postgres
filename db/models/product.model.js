import { Model, DataTypes, Sequelize } from "sequelize";
import { CATEGORY_TABLE } from "./category.model.js";

const PRODUCT_TABLE = "products"

/** @type {import('sequelize').ModelAttributes} */
const ProductSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    allowNull: false,
    type: DataTypes.DOUBLE
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  },
  categoryId: {
    allowNull: false,
    field: 'category_id',
    type: DataTypes.INTEGER,
    references: {
      model: CATEGORY_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  }
}

/**
 * Sequelize model for products sold by the store.
 */
class Product extends Model {
  /**
   * Associates each product with its category.
   *
   * @param {Record<string, typeof Model>} models - Registered Sequelize models.
   * @returns {void}
   */
  static associate(models) {
    this.belongsTo(models.Category, {
      as: 'category'
    })
  }

  /**
   * Returns Sequelize metadata for the products table.
   *
   * @param {import('sequelize').Sequelize} sequelize - Sequelize connection instance.
   * @returns {import('sequelize').ModelOptions} Model configuration.
   */
  static config(sequelize) {
    return {
      sequelize,
      tableName: PRODUCT_TABLE,
      modelName: 'Product',
      timestamps: false,
    };
  }
}

export { PRODUCT_TABLE, ProductSchema, Product }



