import express from 'express'
import CustomerService from '../services/customers.service.js'
import validatorHandler from './../middlewares/validator.handler.js';
import { createUserSchema, getCustomerSchema, updateCustomerSchema, queryCustomerSchema } from '../schemas/customer.schema.js';


const router = express.Router()
const service = new CustomerService()

router.get('/',
  validatorHandler(queryCustomerSchema, 'query'),
  async (req, res, next) => {
  try {
    res.json(await service.find(req.query))
  } catch (e) {
    next(e)
  }
})

router.post('/',
  validatorHandler(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body
      res.status(201).json(await service.create(body))
    } catch (e) {
      next(e)
    }
  })

router.patch('/:id',
  validatorHandler(getCustomerSchema, 'params'),
  validatorHandler(updateCustomerSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params
      const body = req.body
      res.status(201).json(await service.update(id, body))
    } catch (e) {
      next(e)
    }
  }
)

router.delete('/:id',
  validatorHandler(getCustomerSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      res.status(201).json(await service.delete(id));
    } catch (error) {
      next(error);
    }
  }
);

export default router
