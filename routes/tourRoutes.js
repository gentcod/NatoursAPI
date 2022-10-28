const express = require('express');

const {
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  updateTour,
} = require('../controllers/toursControllers');

const router = express.Router();

//Param middleware: only runs for certain parameters
// router.param('id', checkID);
// router.route('/').get(getAllTours).post(checkBody, createTour); //Using a middleware with an https request
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
