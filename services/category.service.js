import boom from '@hapi/boom';
import { models } from '../libs/sequelize.js';

class CategoryService {

  constructor() { }

  async create(data) {
    const newCategory = await models.Category.create(data)
    return newCategory;
  }

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

  async findOne(id) {
    const category = await models.Category.findByPk(id, {
      include: ['products']
    })

    if (!category) {
      throw boom.notFound('Category not found')
    }

    return category;
  }

  async update(id, changes) {
    const category = await this.findOne(id)
    const res = await category.update(changes)
    return res;
  }

  async delete(id) {
    const category = await this.findOne(id)
    await category.destroy()
    return { id };
  }

}

export default CategoryService;
