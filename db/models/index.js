import { UserSchema, User } from './user.model.js'

export function setupModels(sequelize){
  User.init(UserSchema, User.config(sequelize))
}
