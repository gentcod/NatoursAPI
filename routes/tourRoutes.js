const express = require('express');

const {
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  updateTour,
  aliasTopTours,
  getToursStats,
} = require('../controllers/toursControllers');

const router = express.Router();

//Aliasing
router.route('/top-5-tours').get(aliasTopTours, getAllTours);

//Aggregation
router.route('/tours-stats').get(getToursStats);

//Queries
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
