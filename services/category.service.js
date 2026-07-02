import boom from '@hapi/boom';
import { models } from '../libs/sequelize.js';

class CategoryService {

  constructor() { }

  /**
   * Creates a product category.
   *
   * @param {{ name: string, image: string }} data - Category payload validated by Joi.
   * @returns {Promise<import('sequelize').Model>} Created category.
   */
  async create(data) {
    const newCategory = await models.Category.create(data)
    return newCategory;
  }

  /**
   * Lists categories with optional pagination.
   *
   * @param {{ limit?: number, offset?: number }} query - Optional pagination values from the request query.
   * @returns {Promise<Array<import('sequelize').Model>>} Categories returned by Sequelize.
   */
  async find(query) {

    const options = {}

    const { limit, offset } = query
    if (limit && offset) {
      options.limit = limit
      options.offset = offset
    }

    const res = await models.Category.findAll(options);
    return res;
  }

  /**
   * Finds a category by primary key and includes its products.
   *
   * @param {number|string} id - Category id from route params.
   * @returns {Promise<import('sequelize').Model>} Matching category.
   * @throws {import('@hapi/boom').Boom} When the category does not exist.
   */
  async findOne(id) {
    const category = await models.Category.findByPk(id, {
      include: ['products']
    })

    if (!category) {
      throw boom.notFound('Category not found')
    }

    return category;
  }

  /**
   * Updates an existing category.
   *
   * @param {number|string} id - Category id to update.
   * @param {object} changes - Fields accepted by the update schema.
   * @returns {Promise<import('sequelize').Model>} Updated category model.
   * @throws {import('@hapi/boom').Boom} When the category does not exist.
   */
  async update(id, changes) {
    const category = await this.findOne(id)
    const res = await category.update(changes)
    return res;
  }

  /**
   * Deletes a category by id.
   *
   * @param {number|string} id - Category id to delete.
   * @returns {Promise<{ id: number|string }>} Deleted id.
   * @throws {import('@hapi/boom').Boom} When the category does not exist.
   */
  async delete(id) {
    const category = await this.findOne(id)
    await category.destroy()
    return { id };
  }

}

export default CategoryService;
