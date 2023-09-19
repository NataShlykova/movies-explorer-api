const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const movies = require('./movies');
const users = require('./users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../utils/errors/notFound-error');
const { login } = require('../controllers/login');
const { createUser } = require('../controllers/users');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

router.use(auth);

router.use('/users', users);
router.use('/movies', movies);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Некорректно указан путь'));
});

module.exports = router;
