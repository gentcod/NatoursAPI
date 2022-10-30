const mongoose = require('mongoose');

//Create database schema
const toursShema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true, //Ensure value input is unique and cannot be recreated.
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5, //Set default value
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: {
    type: Number,
  },
  summary: {
    type: String,
    trim: true, //Removes white spaces at the beginning and end of a string text
    required: [true, 'A tour must have a summary'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour have a cover image'],
  },
  images: [String], //To have an array of strings
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

//Model created from Schema
const Tour = mongoose.model('Tour', toursShema);

module.exports = Tour;

/**
 * //Document instance created from Schema model
const testTour = new Tour({
  name: 'The Forest Hiker',
  rating: 4.7,
  price: 497,
});

//Save document to database
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.error('Error 🧨:', err);
  });

 */
