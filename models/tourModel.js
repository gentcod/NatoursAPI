const mongoose = require('mongoose');

//Create database schema
const toursShema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
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
