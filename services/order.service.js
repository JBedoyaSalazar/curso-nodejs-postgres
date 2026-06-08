import boom from '@hapi/boom';
import { models } from './../libs/sequelize.js'

class OrderService {

  constructor() { }

  async create(data) {
    const newOrder = await models.Order.create(data)
    return newOrder;
  }

  async addItem(data) {
    const newItem = await models.OrderProduct.create(data)
    return newItem
  }

  async find() {
    const orders = await models.Order.findAll({
      include: [
        {
          association: 'customer',
          include: ['user']
        },
        'items'
      ],
      offset: 0,
      limit: 10
    })
    return orders;
  }

  async findOne(id) {
    const Order = await models.Order.findByPk(id, {
      include: [
        {
          association: 'customer',
          include: ['user']
        },
        'items'
      ]
    });

    if (!Order) {
      throw boom.notFound('Order not found')
    }

    return Order
  }

  async update(id, changes) {
    const order = await this.findOne(id)
    const res = await order.update(changes)
    return res
  }

  async delete(id) {
    const order = await this.findOne(id)
    order.destroy()
    return { id };
  }

}

export default OrderService;
