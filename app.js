const fs = require('fs');

const express = require('express');

//Initalize ExpressJS
const app = express();

//Middleware: they are run for every HTTP request, the order of application is important
app.use(express.json()); //Gives aceess to the params object from the request

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

const getAllTours = (req, res) => {
   console.log(req.requestTime)
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
   }

   const tour = tours.find(el => el.id === id);

   res.status(200).json({
      status: 'success',
      results: tour.length,
      data: {
         tour,
      }
   })
}

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
   }
   res.status(200).json({
      status: 'success',
      tour: '<Updated tour>'
   })
}

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
}

//Route handlers
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

const port = 3000;
//Initialize server
app.listen(port, () => {
   console.log(`App running on port ${port}...`)
})