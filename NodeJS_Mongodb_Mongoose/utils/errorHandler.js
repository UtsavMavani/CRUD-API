const Boom = require('@hapi/boom');

const errorHandler = (err, req, res, next) => {
  // Handle different types of errors using Boom
  if (Boom.isBoom(err)) {
    const { statusCode, payload } = err.output;
    return res.status(statusCode).json(payload);
  }
}

module.exports = errorHandler;
