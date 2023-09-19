const mongoose = require('mongoose');
const url = require('validator/lib/isURL');

const movieSchema = new mongoose.Schema(
  {
    country: {
      required: true,
      type: String,
    },
    director: {
      required: true,
      type: String,
    },
    duration: {
      required: true,
      type: Number,
    },
    year: {
      required: true,
      type: String,
    },
    description: {
      required: true,
      type: String,
    },
    image: {
      required: true,
      type: String,
      validate: {
        validator: (v) => url(v),
        message: 'Указана некорректная ссылка',
      },
    },
    trailerLink: {
      required: true,
      type: String,
      validate: {
        validator: (v) => url(v),
        message: 'Указана некорректная ссылка',
      },
    },
    thumbnail: {
      required: true,
      type: String,
      validate: {
        validator: (v) => url(v),
        message: 'Указана некорректная ссылка',
      },
    },
    owner: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    movieId: {
      required: true,
      type: Number,
    },
    nameRU: {
      required: true,
      type: String,
    },
    nameEN: {
      required: true,
      type: String,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('movie', movieSchema);
