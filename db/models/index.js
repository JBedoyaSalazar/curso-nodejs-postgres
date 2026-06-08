import { UserSchema, User } from './user.model.js'
import { CustomerSchema, Customer } from './customers.model.js'
import { ProductSchema, Product } from './product.model.js'
import { CategorySchema, Category } from './category.model.js'
import { OrderSchema, Order } from './order.model.js'
import { OrderProcductSchema, OrderProduct } from './order-product.model.js'

export function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize))
  Customer.init(CustomerSchema, Customer.config(sequelize))
  Product.init(ProductSchema, Product.config(sequelize))
  Category.init(CategorySchema, Category.config(sequelize))
  Order.init(OrderSchema, Order.config(sequelize))
  OrderProduct.init(OrderProcductSchema, OrderProduct.config(sequelize))

  User.associate(sequelize.models)
  Customer.associate(sequelize.models)
  Category.associate(sequelize.models)
  Product.associate(sequelize.models)
  Order.associate(sequelize.models)
  
}
