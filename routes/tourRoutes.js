const express = require('express');

const authMiddleware = require('../middlewares/authMiddlewares')

const {
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  updateTour,
  aliasTopTours,
  getToursStats,
  getMonthlyPlan,
} = require('../controllers/toursControllers');

const router = express.Router();

//Aliasing
router.route('/top-5-tours').get(aliasTopTours, getAllTours);

//Aggregation
router.route('/tours-stats').get(getToursStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

//Queries
router
  .route('/')
  .get(authMiddleware.protect, getAllTours)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'lead-guide'),
    createTour,
  );
router
  .route('/:id')
  .get(getTour)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'lead-guide'),
    updateTour,
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'lead-guide'),
    deleteTour,
  );

module.exports = router;
