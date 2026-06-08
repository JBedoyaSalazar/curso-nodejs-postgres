import Joi from "joi";

const id = Joi.number().integer();
const customerId = Joi.number().integer()
const orderId = Joi.number().integer()
const productId = Joi.number().integer()
const amount = Joi.number().integer()
const limit = Joi.number().integer();
const offset = Joi.number().integer();

const createOrderSchema = Joi.object({
  customerId: customerId.required()
})

const updateOrderSchema = Joi.object({
  customerId
})

const getOrderSchema = Joi.object({
  id: id.required()
})

const addItemSchema = Joi.object({
  orderId: orderId.required(),
  productId: productId.required(),
  amount: amount.required()
})

const queryOrderSchema = Joi.object({
  limit,
  offset
})

export { createOrderSchema, updateOrderSchema, getOrderSchema,addItemSchema, queryOrderSchema}
