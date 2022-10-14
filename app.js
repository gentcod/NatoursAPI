const fs = require('fs');

const express = require('express');
const morgan = require('morgan');

//Initalize ExpressJS
const app = express();

//Middleware: they are run for every HTTP request, the order of application is important
app.use(morgan('dev'));
app.use(express.json()); //Gives aceess to the params object from the request, Parse data from body

app.use((req, res, next) => {
   console.log('Hello from the middleware');
   next();
})

app.use((req, res, next) => {
   req.requestTime = new Date().toISOString();
   next();
})

/////////////////////////////////////
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

//Route Handler callbacks
const getAllTours = (req, res) => {
   // console.log(req.requestTime)
   res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
         tours
      }
   })
};

const getTour = (req, res) => {
   const id = +req.params.id;

   if (id >= tours.length) {
      return res.status(404).json({
         status: 'fail',
         message: 'Invalid ID'
      })
   };

   const tour = tours.find(el => el.id === id);

   res.status(200).json({
      status: 'success',
      results: tour.length,
      data: {
         tour,
      }
   });
};

const createTour = (req, res) => {
   // console.log(req.body);

   const newId = tours[tours.length - 1].id + 1;
   const newTour = Object.assign({id: newId}, req.body);

   tours.push(newTour);
   fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
      res.status(201).json({
         status: 'success',
         data: {
            tours: newTour
         }
      })
   });

}

const updateTour = (req, res) => {
   if(req.params.id >= tours.length) {
      return res.status(404).json({
         status: 'fail',
         message: 'Invalid ID'
      })
   };
   res.status(200).json({
      status: 'success',
      tour: '<Updated tour>'
   })
};

const deleteTour = (req, res) => {
   if(req.params.id >= tours.length) {
      return res.status(404).json({
         status: 'fail',
         message: 'Invalid ID'
      })
   }
   res.status(204).json({
      status: 'success',
      data: null,
   })
};

const users = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/users.json`))
const checkUser = (request) => users.find(el => el._id === request.params.id)

const getAllUsers = (req, res) => {
   res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
         users
      }
   })
}

const createUser = (req, res) => {
   const newId = 1
   const newUser = Object.assign({id: newId}, req.body)

   users.push(newUser);
   fs.writeFile(`${__dirname}/dev-data/data/users.json`, JSON.stringify(users), err => {
      res.status(201).json({
         status: 'success',
         data: {
            users: newUser
         }
      })
   });
}

const getUser = (req, res) => {
   const user = checkUser(req);

   if (!user) {
      return res.status(404).json({
         status: 'fail',
         message: 'Invalid ID'
      })
   };


   res.status(200).json({
      status: 'success',
      results: user.length,
      data: {
         user,
      }
   });
}

const updateUser = (req, res) => {
   const user = checkUser(req);

   if(!user) {
      return res.status(404).json({
         status: 'fail',
         message: 'Invalid ID'
      })
   };
   res.status(200).json({
      status: 'success',
      tour: '<Updated tour>'
   })
}

const deleteUser = (req, res) => {
   const user = checkUser(req);

   if(!user) {
      return res.status(404).json({
         status: 'fail',
         message: 'Invalid ID'
      })
   }
   res.status(204).json({
      status: 'success',
      data: null,
   })
}

/////////////////////////////////////
//Route handlers

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
app.route('/api/v1/tours').get(getAllTours).post(createTour)

app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour)

//User Resource
app.route('/api/v1/users').get(getAllUsers).post(createUser)

app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser)

const port = 3000;
//Initialize server
app.listen(port, () => {
   console.log(`App running on port ${port}...`)
});