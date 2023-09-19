const movies = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  getCards,
  creatCard,
  deleteCard,
} = require('../controllers/movies');

movies.get('/', getCards);
movies.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().uri().required(),
    trailerLink: Joi.string().uri().required(),
    thumbnail: Joi.string().uri().required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), creatCard);

movies.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), deleteCard);

module.exports = movies;
