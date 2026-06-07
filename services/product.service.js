// import { faker } from '@faker-js/faker';
import boom from '@hapi/boom';
import { models } from '../libs/sequelize.js';

class ProductsService {

  constructor(){
    // this.generate();
  }

  // generate() {
  //   const limit = 100;
  //   for (let index = 0; index < limit; index++) {
  //     this.products.push({
  //       id: faker.datatype.uuid(),
  //       name: faker.commerce.productName(),
  //       price: parseInt(faker.commerce.price(), 10),
  //       image: faker.image.imageUrl(),
  //       isBlock: faker.datatype.boolean(),
  //     });
  //   }
  // }

  async create(data) {
    const newProduct = await models.Product.create(data);
    return newProduct;
  }

  async find() {
    const products = await models.Product.findAll()
    return products;
  }

  async findOne(id) {
    const product = await models.Product.findByPk(id);

    if(!product){
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
