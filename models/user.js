// const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
// const UnauthorizedError = require('../utils/errors/unauthorized-error');

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    unique: true,
    type: String,
    required: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: ({ value }) => `${value} недействителен!`,
    },
  },
  password: {
    select: false,
    type: String,
    required: true,
  },
}, { toJSON: { useProjection: true }, toObject: { useProjection: true } });

// userSchema.statics.findUserByCredentials = function (email, password) {
//   return this
//     .findOne({ email })
//     .select('+password')
//     .then((user) => {
//       if (!user) {
//         throw new UnauthorizedError('Неправильные почта или пароль');
//       }

//       return bcrypt.compare(password, user.password)
//         .then((matched) => {
//           if (!matched) {
//             throw new UnauthorizedError('Неправильные почта или пароль');
//           }
//           return user;
//         });
//     });
// };

module.exports = mongoose.model('user', userSchema);
