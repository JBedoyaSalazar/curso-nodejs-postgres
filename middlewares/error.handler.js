import { ValidationError } from "sequelize";

function logErrors (err, req, res, next) {
  console.error("====== ERROR ======");
  console.error(err);
  console.error(err.stack);
  next(err);
}

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

function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  } else {
    next(err);
  }
}

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
