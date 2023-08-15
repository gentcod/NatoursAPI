const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
   return jwt.sign({id: id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
   })
}

exports.signUp = catchAsync(async (req, res, next) => {
   const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
   });

   //Payload, Secret and Options
   const token = signToken(newUser._id);

   res.status(201).json({
      status: 'success',
      token,
      data: {
         user: newUser,
      }
   });
});

exports.signIn = catchAsync(async (req, res, next) => {
   const { email, password } = req.body;

   if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
   }

   const user = await User.findOne({email: email}).select('+password');

   if (!user || !(await user.correctPassword(password, user.password))) return next(new AppError('Email or password is incorrect, please check and try again', 401));
   
   const token = signToken(user._id);

   res.status(200).json({
      status: 'success',
      token,
   });
});