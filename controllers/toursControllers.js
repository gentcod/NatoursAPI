const Tour = require('../models/tourModel');

exports.getAllTours = (req, res) => {
  // console.log(req.requestTime)
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // results: tours.length,
    // data: {
    //   tours,
    // },
  });
};

exports.getTour = (req, res) => {
  // const id = +req.params.id;

  // const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    // results: tour.length,
    // data: {
    //   tour,
    // },
  });
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour();
    // newTour.save();

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tours: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    tour: '<Updated tour>',
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, value) => {
//   // if (req.params.id >= tours.length) {
//   //   return res.status(404).json({
//   //     status: 'fail',
//   //     message: 'Invalid ID',
//   //   });
//   // }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   const { body } = req;
//   if (!body.name || !body.price) {
//     res.status(400).json({
//       status: 'failed',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };
