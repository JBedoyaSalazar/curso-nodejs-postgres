import { ValidationError } from "sequelize";

/**
 * Logs the error and delegates it to the next error middleware.
 *
 * @param {Error} err - Error raised by a previous middleware or route handler.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {void}
 */
function logErrors (err, req, res, next) {
  next(err);
}

/**
 * Final fallback error handler for errors not handled by previous middleware.
 *
 * @param {Error} err - Error raised by the application.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {void}
 */
function errorHandler(err, req, res, next) {

  console.log("ERROR HANDLER");
  console.log(err);
  console.log(res);
  console.log(typeof res.status);

  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
}

/**
 * Sends formatted HTTP responses for Boom errors.
 *
 * @param {Error & { isBoom?: boolean, output?: object }} err - Error that may have Boom metadata.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {void}
 */
function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  } else {
    next(err);
  }
}

/**
 * Converts Sequelize validation errors into conflict responses.
 *
 * @param {Error} err - Error that may be a Sequelize ValidationError.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {void}
 */
function ormErrorHandler(err, req, res, next){
  if(err instanceof ValidationError){
    return res.status(409).json({
      statusCode: 409,
      message: err.name,
    })
  }
  next(err)
}


export { logErrors, errorHandler, boomErrorHandler, ormErrorHandler };
