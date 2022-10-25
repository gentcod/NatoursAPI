const express = require('express');
const morgan = require('morgan');
// const {checkBody} = require('./controllers/toursControllers');

//Initalize ExpressJS
const app = express();

//Dev modules
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//Middleware: they are run for every HTTP request, the order of application is important
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json()); //Gives aceess to the params object from the request, Parse data from body
app.use(express.static(`${__dirname}/public`)); //To show static html pages

//Dev created middlewares
// app.use((req, res, next) => {
//    console.log('Hello from the middleware 😎');
//    next();
// })

// app.use((req, res, next) => {
//    req.requestTime = new Date().toISOString();
//    next();
// })

//Mounting Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;

/////////////////////////////////////
//Reference

//Tours Resource
// //GET Request: Read Opreation
// app.get('/api/v1/tours', getAllTours)

// app.get('/api/v1/tours/:id', getTour);

// //POST Request: Create Operation
// app.post('/api/v1/tours', createTour);

// //PATCH: Update Operations
// app.patch('/api/v1/tours/:id', updateTour);

// //DELETE: Delete Operations
// app.delete('/api/v1/tours/:id', deleteTour);

//Chaining Route handlers
// app.route('/api/v1/tours').get(getAllTours).post(createTour)

// app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour)

//User Resource
// app.route('/api/v1/users').get(getAllUsers).post(createUser)

// app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser)
