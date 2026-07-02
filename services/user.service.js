import boom from '@hapi/boom';
import { models } from '../libs/sequelize.js';
import bycrypt from 'bcrypt';

class UserService {
  constructor() { }

  /**
   * Creates a user after hashing the received password.
   *
   * @param {{ email: string, password: string, role: string }} data - User data validated by Joi.
   * @returns {Promise<import('sequelize').Model>} Created user without password in dataValues.
   */
  async create(data) {
    const hash = await bycrypt.hash(data.password, 10);
    data.password = hash;
    const newUser = await models.User.create(data);
    delete newUser.dataValues.password;
    return newUser;
  }

  /**
   * Lists users and includes their associated customer when it exists.
   *
   * @param {{ limit?: number, offset?: number }} query - Optional pagination values from the request query.
   * @returns {Promise<Array<import('sequelize').Model>>} Users returned by Sequelize.
   */
  async find(query) {

    const options = {
      include: ['customer']
    }

    const { limit, offset } = query
    if (limit && offset) {
      options.limit = limit
      options.offset = offset
    }

    const res = await models.User.findAll(options);
    return res;
  }

  /**
   * Finds a user by email for authentication and recovery flows.
   *
   * @param {string} email - Email address to search.
   * @returns {Promise<import('sequelize').Model|null>} Matching user or null.
   */
  async findByEmail(email) {

    const res = await models.User.findOne({
      where: {
        email
      }
    });
    return res;
  }

  /**
   * Finds a user by primary key.
   *
   * @param {number|string} id - User id from route params or service calls.
   * @returns {Promise<import('sequelize').Model>} Matching user.
   * @throws {import('@hapi/boom').Boom} When the user does not exist.
   */
  async findOne(id) {
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound('user not found');
    }
    return user;
  }

  /**
   * Updates an existing user.
   *
   * @param {number|string} id - User id to update.
   * @param {object} changes - Fields accepted by the update schema or internal service calls.
   * @returns {Promise<import('sequelize').Model>} Updated user model.
   * @throws {import('@hapi/boom').Boom} When the user does not exist.
   */
  async update(id, changes) {
    const user = await this.findOne(id);
    const res = await user.update(changes);
    return res;
  }

  /**
   * Deletes a user by id.
   *
   * @param {number|string} id - User id to delete.
   * @returns {Promise<{ id: number|string }>} Deleted id.
   * @throws {import('@hapi/boom').Boom} When the user does not exist.
   */
  async delete(id) {
    const user = await this.findOne(id);
    await user.destroy();
    return { id };
  }
}

export default UserService;
