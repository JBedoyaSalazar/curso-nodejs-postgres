import { UserSchema, User } from './user.model.js'
import { CustomerSchema, Customer } from './customers.model.js'

export function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize))
  Customer.init(CustomerSchema, Customer.config(sequelize))


  Customer.associate(sequelize.models)
  User.associate(sequelize.models)
}
