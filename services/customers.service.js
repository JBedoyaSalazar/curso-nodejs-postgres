import boom from "@hapi/boom";
import { models } from "../libs/sequelize.js";
import { sequelize } from "../libs/sequelize.js";

export default class CustomerService {
  constructor() { }

  async find() {
    const res = await models.Customer.findAll({
      include: ['user']
    })
    return res
  }

  async findOne(id) {
    const user = await models.Customer.findByPk(id)

    if (!user) {
      throw boom.notFound("Customer not found")
    }

    return user
  }

  async create(data) {
    const transaction = await sequelize.transaction();

    try {
      let userId;

      if (data.userId) {
        userId = data.userId;
      } else {
        const user = await models.User.create(
          data.user,
          { transaction }
        );

        userId = user.id;
      }

      const { user, ...customerData } = data;

      const customer = await models.Customer.create(
        {
          ...customerData,
          userId
        },
        { transaction }
      );

      await transaction.commit();

      return customer;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
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
