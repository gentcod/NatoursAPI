const express = require('express');
const { signUp, signIn } = require('../controllers/authController')

const {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} = require('../controllers/userControllers');

const router = express.Router();

router.post('/signup', signUp)
router.post('/signin', signIn)

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
