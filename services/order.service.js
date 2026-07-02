import boom from '@hapi/boom';
import { models } from './../libs/sequelize.js';

class OrderService {
  constructor() {}

  /**
   * Creates an order for a customer.
   *
   * @param {{ customerId: number }} data - Order payload validated by Joi.
   * @returns {Promise<import('sequelize').Model>} Created order.
   */
  async create(data) {
    const newOrder = await models.Order.create(data);
    return newOrder;
  }

  /**
   * Adds a product item to an order through the join table.
   *
   * @param {{ orderId: number, productId: number, amount: number }} data - Item payload validated by Joi.
   * @returns {Promise<import('sequelize').Model>} Created order-product row.
   */
  async addItem(data) {
    const newItem = await models.OrderProduct.create(data);
    return newItem;
  }

  /**
   * Lists orders with customer, user and item associations.
   *
   * @param {{ limit?: number, offset?: number }} query - Optional pagination values from the request query.
   * @returns {Promise<Array<import('sequelize').Model>>} Orders returned by Sequelize.
   */
  async find(query) {
    const options = {
      include: [
        {
          association: 'customer',
          include: ['user'],
        },
        'items',
      ],
    };

    const { limit, offset } = query;

    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    const orders = await models.Order.findAll(options);
    return orders;
  }

  /**
   * Lists orders that belong to the customer associated with a JWT user id.
   *
   * @param {number|string} userId - User id stored in the JWT `sub` claim.
   * @returns {Promise<Array<import('sequelize').Model>>} Orders found for the authenticated user.
   */
  async findByUser(userId) {
    const orders = await models.Order.findAll({
      where: {
        '$customer.user.id$': userId,
      },
      include: [
        {
          association: 'customer',
          include: ['user']
        },
      ],
    });
    return orders;
  }

  /**
   * Finds an order by primary key and includes customer, user and item associations.
   *
   * @param {number|string} id - Order id from route params.
   * @returns {Promise<import('sequelize').Model>} Matching order.
   * @throws {import('@hapi/boom').Boom} When the order does not exist.
   */
  async findOne(id) {
    const Order = await models.Order.findByPk(id, {
      include: [
        {
          association: 'customer',
          include: ['user'],
        },
        'items',
      ],
    });

    if (!Order) {
      throw boom.notFound('Order not found');
    }

    return Order;
  }

  /**
   * Updates an existing order.
   *
   * @param {number|string} id - Order id to update.
   * @param {object} changes - Fields accepted by the update schema.
   * @returns {Promise<import('sequelize').Model>} Updated order model.
   * @throws {import('@hapi/boom').Boom} When the order does not exist.
   */
  async update(id, changes) {
    const order = await this.findOne(id);
    const res = await order.update(changes);
    return res;
  }

  /**
   * Deletes an order by id.
   *
   * @param {number|string} id - Order id to delete.
   * @returns {Promise<{ id: number|string }>} Deleted id.
   * @throws {import('@hapi/boom').Boom} When the order does not exist.
   */
  async delete(id) {
    const order = await this.findOne(id);
    order.destroy();
    return { id };
  }
}

export default OrderService;
