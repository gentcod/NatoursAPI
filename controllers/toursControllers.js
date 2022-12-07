const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

//Aliasing: middleware to set particular params to fit a specific query request
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // console.log(req.query);
    //1. FILTERING
    // //Create shallow copy of query object
    // const queryObj = { ...req.query };
    // //Query fields to be excluded
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // //Filter Query: Iterate through the array and delete item in array from the query object
    // excludedFields.forEach((el) => delete queryObj[el]);

    //2. ADVANCED FILTERING
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // // const query = await Tour.find()
    // //   .where('duration')
    // //   .equals(5)
    // //   .where('difficulty')
    // //   .equals('easy');

    // let query = Tour.find(JSON.parse(queryStr));

    //3. SORTING
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    //4. FIELD LIMITING
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // //4. PAGINATION
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 1;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error(`Page does not exist`);
    // }

    //Execute Query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    //Send request
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `Failed to fetch all tours: ${err}`,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);
    // const tour = await Tour.findOne(id); //To find only one document in the collection

    res.status(200).json({
      status: 'success',
      results: tour.length,
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
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

exports.updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    await Tour.findOneAndDelete(id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

//Accessing data from local directory
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
