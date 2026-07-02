import boom from '@hapi/boom';

/**
 * Builds an Express middleware that validates a request property with a Joi schema.
 *
 * @param {import('joi').ObjectSchema} schema - Joi schema used to validate the request data.
 * @param {'body'|'params'|'query'} property - Request property to validate.
 * @returns {import('express').RequestHandler} Middleware that forwards Boom bad request errors to the error chain.
 *
 * @example
 * router.post('/', validatorHandler(createProductSchema, 'body'), handler);
 */
function validatorHandler(schema, property) {
  return (req, res, next) => {
    const data = req[property];
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      next(boom.badRequest(error));
    }
    next();
  }
}

export default validatorHandler;
