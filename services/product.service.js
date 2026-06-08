import { Op } from 'sequelize';
import boom from '@hapi/boom';
import { models } from '../libs/sequelize.js';

class ProductsService {

  constructor() { }

  async create(data) {
    const newProduct = await models.Product.create(data);
    return newProduct;
  }

  async find(query) {
    const options = {
      include: ['category'],
      where: {}
    }

    const { limit, offset, price, price_min, price_max } = query
    if (limit && offset) {
      options.limit = limit
      options.offset = offset
    }

    if (price) {
      options.where.price = price
    }

    if(price_min && price_max){
      options.where.price = {
        [Op.between]:[price_min, price_max]
      }
    }

    const products = await models.Product.findAll(options)
    return products;
  }

  async findOne(id) {
    const product = await models.Product.findByPk(id, {
      include: ['category']
    });

    if (!product) {
      throw boom.notFound('product not found')
    }

    return product
  }

  async update(id, changes) {
    const product = await this.findOne(id)
    const res = await product.update(changes)
    return res
  }

  async delete(id) {
    const product = await this.findOne(id)
    product.destroy()
    return { id };
  }

}

export default ProductsService;
