import boom from "@hapi/boom";
import { models } from "../libs/sequelize.js";

export default class CustomerService {
  constructor() { }

  async find() {
    const res = await models.Customer.findAll()
    return res
  }

  async findOne(id) {
    const user = await models.Customer.findByPk(id)

    if (!user) {
      throw boom.notFound("Customer not found")
    }

    return user
  }

  async create(customer) {
    const newCustomer = await models.Customer.create(customer)
    return newCustomer
  }

  async update(id, changes) {
    const user = await this.findOne(id)
    const res = await user.update(changes)
    return res
  }

  async delete(id) {
    const model = await this.findOne(id)
    await model.destroy()
    return { id: true }
  }
}
