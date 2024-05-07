const express = require('express');
const authMiddleware = require('../middlewares/authMiddlewares')
const { signUp, signIn, forgotPassword, resetPassword, updatePassword } = require('../controllers/authController')

const {
  createUser,
  deleteMe,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} = require('../controllers/userControllers');

const router = express.Router();

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/forgot-password', forgotPassword)
router.patch('/reset-password', resetPassword)
router.patch('/update-password', authMiddleware.protect, updatePassword)

router.route('/').get(getAllUsers).post(createUser);
router.route('/delete-me').patch(authMiddleware.protect, deleteMe)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
