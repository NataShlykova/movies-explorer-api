const jwt = require('jsonwebtoken');
const { SECRET, NODE_PRODUCTION } = require('../utils/Constans');
const UnauthorizedError = require('../utils/errors/unauthorized-error');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Нужна авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === NODE_PRODUCTION ? JWT_SECRET : SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Нужна авторизация'));
  }
  req.user = payload;
  return next();
};
