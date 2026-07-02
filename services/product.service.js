import { Op } from 'sequelize';
import boom from '@hapi/boom';
import { models } from '../libs/sequelize.js';

class ProductsService {

  constructor() { }

  /**
   * Creates a product associated with an existing category.
   *
   * @param {{ name: string, price: number, description: string, image: string, categoryId: number }} data - Product payload validated by Joi.
   * @returns {Promise<import('sequelize').Model>} Created product.
   */
  async create(data) {
    const newProduct = await models.Product.create(data);
    return newProduct;
  }

  /**
   * Lists products with their category and optional pagination or price filters.
   *
   * @param {{ limit?: number, offset?: number, price?: number, price_min?: number, price_max?: number }} query - Query values validated by Joi.
   * @returns {Promise<Array<import('sequelize').Model>>} Products returned by Sequelize.
   */
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

  /**
   * Finds a product by primary key and includes its category.
   *
   * @param {number|string} id - Product id from route params.
   * @returns {Promise<import('sequelize').Model>} Matching product.
   * @throws {import('@hapi/boom').Boom} When the product does not exist.
   */
  async findOne(id) {
    const product = await models.Product.findByPk(id, {
      include: ['category']
    });

    if (!product) {
      throw boom.notFound('product not found')
    }

    return product
  }

  /**
   * Updates an existing product.
   *
   * @param {number|string} id - Product id to update.
   * @param {object} changes - Fields accepted by the update schema.
   * @returns {Promise<import('sequelize').Model>} Updated product model.
   * @throws {import('@hapi/boom').Boom} When the product does not exist.
   */
  async update(id, changes) {
    const product = await this.findOne(id)
    const res = await product.update(changes)
    return res
  }

  /**
   * Deletes a product by id.
   *
   * @param {number|string} id - Product id to delete.
   * @returns {Promise<{ id: number|string }>} Deleted id.
   * @throws {import('@hapi/boom').Boom} When the product does not exist.
   */
  async delete(id) {
    const product = await this.findOne(id)
    product.destroy()
    return { id };
  }

}

export default ProductsService;
