require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const celebrateErrors = require('celebrate').errors;
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const router = require('./routes/index');
const { DEFAULT_ERROR_CODE } = require('./utils/Constans');
const cors = require('./middlewares/cors');
const limit = require('./utils/limit');
const { logRequest, logError } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

const app = express();
app.use(helmet());
app.use(cors);
app.use(cookieParser());
app.use(express.json());
app.use(logRequest);
app.use(limit);
app.use('/api', router);
app.use(logError);
app.use(celebrateErrors());

app.use((err, req, res, next) => {
  const { statusCode = DEFAULT_ERROR_CODE, message } = err;
  res.status(statusCode).send({
    message: statusCode === DEFAULT_ERROR_CODE ? 'Ошибка на сервере' : message,
  });
  next();
});

app.listen(PORT);
