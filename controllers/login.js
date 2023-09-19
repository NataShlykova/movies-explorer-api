const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SECRET, NODE_PRODUCTION } = require('../utils/Constans');
const UnauthorizedError = require('../utils/errors/unauthorized-error');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .select('+password')
    .then(async (user) => {
      if (!user) {
        throw new UnauthorizedError('Нужна авторизация');
      }

      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        return next(new UnauthorizedError('Нужна авторизация'));
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === NODE_PRODUCTION ? JWT_SECRET : SECRET,
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch(next);
};
