const express = require('express');
const morgan = require('morgan');
const expRateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

//Dev modules
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//Initalize ExpressJS
const app = express();

// MIDDLEWARES
// Secure Request Header
app.use(helmet())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Implement Rate Limiting
const limiter = expRateLimit.rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000,
  message: {
    status: 'error',
    message: 'You have exhausted the maximum number of requests that can be made to the server. Try again later'
  }
})

app.use('/api', limiter);

// Request Body parsing 
app.use(express.json({ limit: '10kb'}));

// Data sanitization for request body
app.use(mongoSanitize())

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()

  next()
})

//Mounting Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//Error Handling
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;