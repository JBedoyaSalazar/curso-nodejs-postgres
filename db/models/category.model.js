import { Model, DataTypes, Sequelize } from "sequelize";

const CATEGORY_TABLE = "categories"

/** @type {import('sequelize').ModelAttributes} */
const CategorySchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true
  },
  image: {
    type: DataTypes.STRING
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  }
}

/**
 * Sequelize model for product categories.
 */
class Category extends Model {
  /**
   * Associates a category with its products.
   *
   * @param {Record<string, typeof Model>} models - Registered Sequelize models.
   * @returns {void}
   */
  static associate(models) {
    this.hasMany(models.Product, {
      as: 'products',
      foreignKey: 'categoryId'
    })
  }

  /**
   * Returns Sequelize metadata for the categories table.
   *
   * @param {import('sequelize').Sequelize} sequelize - Sequelize connection instance.
   * @returns {import('sequelize').ModelOptions} Model configuration.
   */
  static config(sequelize) {
    return {
      sequelize,
      tableName: CATEGORY_TABLE,
      modelName: 'Category',
      timestamps: false,
    };
  }
}

export { CATEGORY_TABLE, CategorySchema, Category }
