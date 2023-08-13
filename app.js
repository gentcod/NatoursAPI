const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

//Dev modules
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//Initalize ExpressJS
const app = express();

//Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//Mounting Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//Error Handling
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Cannot find ${req.originalUrl} on the server`
  // });
  next(new AppError(`Cannot find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
