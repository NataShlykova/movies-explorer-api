const bcrypt = require('bcryptjs');
const { ValidationError, CastError, DocumentNotFoundError } = require('mongoose').Error;

const User = require('../models/user');
const { VALIDATION_CODE } = require('../utils/Constans');
const NotFoundError = require('../utils/errors/notFound-error');
const ConflictError = require('../utils/errors/conflict-error');
const Validation = require('../utils/errors/validation-error');

module.exports.getUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById({ _id })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === DocumentNotFoundError) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new Validation('Ошибка валидации данных');
  }
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((user) => {
          res.status(VALIDATION_CODE).send(user);
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(
              new ConflictError(
                'Адрес почты уже зарегистрирован в базе данных',
              ),
            );
          } else if (err.name === ValidationError) {
            next(new Validation('Ошибка валидации данных'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  const _id = req.params.userId;

  User.findById({ _id })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Электронная почта уже есть в базе данных'));
      } else if (err.name === ValidationError || err.name === CastError) {
        next(new Validation('Ошибка валидации данных'));
      } else {
        next(err);
      }
    });
};
