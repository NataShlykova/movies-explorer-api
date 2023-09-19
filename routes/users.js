const users = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const { getUser, updateProfile } = require('../controllers/users');

users.get('/me', getUser);
users.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateProfile);

module.exports = users;
