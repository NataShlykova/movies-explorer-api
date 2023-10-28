const { ValidationError, CastError } = require('mongoose').Error;
const Movie = require('../models/movie');
const {
  VALIDATION_CODE,
} = require('../utils/Constans');
const ConflictError = require('../utils/errors/conflict-error');
const Validation = require('../utils/errors/validation-error');
const NotFoundError = require('../utils/errors/notFound-error');
const ForbiddenError = require('../utils/errors/forbidden-error');

module.exports.getCards = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .populate([{ path: 'owner', model: 'user' }])
    .then((movie) => {
      res.status(200).send(movie);
    })

    .catch(next);
};

module.exports.creatCard = (req, res, next) => {
  const owner = req.user._id;

  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.find({ owner, movieId })
    .then((item) => {
      if (item.length) {
        throw new ConflictError('Фильм уже был добавлен');
      } else {
        Movie.create({
          country,
          director,
          duration,
          year,
          description,
          image,
          trailerLink,
          thumbnail,
          movieId,
          nameRU,
          nameEN,
          owner,
        })
          .then((movie) => movie.populate('owner'))
          .then((movie) => res.status(VALIDATION_CODE).send(movie))
          .catch((err) => {
            if (err.name === ValidationError) {
              next(new Validation('Ошибка валидации данных'));
            } else {
              next(err);
            }
          });
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const _id = req.params.movieId;

  Movie.findOne({ _id })
    .populate([
      { path: 'owner', model: 'user' },
    ])
    .then(async (movie) => {
      if (!movie) {
        throw new NotFoundError('Карточки с указанным _id не cуществует');
      }
      if (movie.owner._id.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('Удалять можно только свою карточку');
      }
      const cardDeleted = await movie
        .deleteOne()
        .populate([{ path: 'owner', model: 'user' }]);
      res.send(cardDeleted);
    })
    .catch((err) => {
      if (err === CastError) {
        next(new Validation('Ошибка валидации данных'));
      } else {
        next(err);
      }
    });
};
