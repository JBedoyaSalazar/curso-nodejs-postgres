import boom from "@hapi/boom";
import { models } from "../libs/sequelize.js";
import { sequelize } from "../libs/sequelize.js";
import bycrypt from "bcrypt";

export default class CustomerService {
  constructor() { }

  /**
   * Lists customers with their associated user.
   *
   * @param {{ limit?: number, offset?: number }} query - Optional pagination values from the request query.
   * @returns {Promise<Array<import('sequelize').Model>>} Customers returned by Sequelize.
   */
  async find(query) {
    const options = {
      include: ['user']
    }

    const { limit, offset } = query
    if (limit && offset) {
      options.limit = limit
      options.offset = offset
    }

    const res = await models.Customer.findAll(options)
    return res
  }

  /**
   * Finds a customer by primary key.
   *
   * @param {number|string} id - Customer id from route params.
   * @returns {Promise<import('sequelize').Model>} Matching customer.
   * @throws {import('@hapi/boom').Boom} When the customer does not exist.
   */
  async findOne(id) {
    const user = await models.Customer.findByPk(id)

    if (!user) {
      throw boom.notFound("Customer not found")
    }

    return user
  }

  /**
   * Creates a customer and, when provided, its related user inside one transaction.
   *
   * @param {{ name: string, lastName: string, phone: string, user?: { email: string, password: string }, userId?: number }} data - Customer payload validated by Joi.
   * @returns {Promise<import('sequelize').Model>} Created customer.
   * @throws {Error} When user or customer creation fails and the transaction is rolled back.
   */
  async create(data) {
    const hash = await bycrypt.hash(data.user.password, 10);
    data.user.password = hash;
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

  /**
   * Updates an existing customer.
   *
   * @param {number|string} id - Customer id to update.
   * @param {object} changes - Fields accepted by the update schema.
   * @returns {Promise<import('sequelize').Model>} Updated customer model.
   * @throws {import('@hapi/boom').Boom} When the customer does not exist.
   */
  async update(id, changes) {
    const user = await this.findOne(id)
    const res = await user.update(changes)
    return res
  }

  /**
   * Deletes a customer by id.
   *
   * @param {number|string} id - Customer id to delete.
   * @returns {Promise<{ id: boolean }>} Current service confirmation payload.
   * @throws {import('@hapi/boom').Boom} When the customer does not exist.
   */
  async delete(id) {
    const model = await this.findOne(id)
    await model.destroy()
    return { id: true }
  }
}
