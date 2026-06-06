import Joi from "joi";

const id = Joi.number().integer()
const name = Joi.string().min(3).max(30)
const lastName = Joi.string()
const phone = Joi.string()
const email = Joi.string().email()
const password = Joi.string()
const userId = Joi.number().integer()

const getCustomerSchema = Joi.object({
  id: id.required()
})

const createUserSchema = Joi.object({
  name: name.required(),
  lastName: lastName.required(),
  phone: phone.required(),
  userId,
  user: Joi.object({
    email: email.required(),
    password: password.required()
  })
}).xor('userId', 'user');

const updateCustomerSchema = Joi.object({
  name,
  lastName,
  phone,
  userId
})

export { createUserSchema, getCustomerSchema, updateCustomerSchema}
