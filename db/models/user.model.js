import { Model, DataTypes, Sequelize } from 'sequelize';

const USER_TABLE = 'users';

/** @type {import('sequelize').ModelAttributes} */
const UserSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
    validate:{
      isEmail:true
    }
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING
  },
  recoveryToken: {
    field: 'recovery_token',
    allowNull: true,
    type: DataTypes.STRING
  },
  role:{
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'customer'
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  }
};

/**
 * Sequelize model for application users.
 */
class User extends Model {
  /**
   * Associates one user with one customer profile.
   *
   * @param {Record<string, typeof Model>} models - Registered Sequelize models.
   * @returns {void}
   */
  static associate(models) {
    this.hasOne(models.Customer,{
      as: 'customer',
      foreignKey: 'userId'
    })
  }

  /**
   * Returns Sequelize metadata for the users table.
   *
   * @param {import('sequelize').Sequelize} sequelize - Sequelize connection instance.
   * @returns {import('sequelize').ModelOptions} Model configuration.
   */
  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
      timestamps: false,
    };
  }
}

export { USER_TABLE, UserSchema, User };
