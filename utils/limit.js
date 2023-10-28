const limit = require('express-rate-limit');

module.exports = limit({
  windowMs: 1000 * 100 * 10,
  max: 100,
});
