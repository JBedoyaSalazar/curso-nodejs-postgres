// import { faker } from '@faker-js/faker';
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
    }

    const { limit, offset } = query
    if(limit && offset){
      options.limit = limit
      options.offset = offset
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
