const tokenGenerator = require('../utils/tokenGenerator');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.protect = catchAsync(async (req, res, next) => {
   let token;
 
   if (
     req.headers.authorization &&
     req.headers.authorization.startsWith('Bearer')
   ) {
     token = req.headers.authorization.split(' ')[1];
   }
 
   if (!token) {
     return next(
       new AppError('You are not logged in. Please log in to get access', 401),
     );
   }
 
   const decoded = await tokenGenerator.verify(token);
 
   const user = await User.findById(decoded.id);
   if (!user) {
     return next(new AppError('User not found', 401));
   }
 
   const passwordIsModified = user.changedPasswordAfter(decoded.iat);
   if (passwordIsModified)
     return next(
       new AppError(
         'Password was changed. Please log in again to get access',
         401,
       ),
     );
 
   req.user = user;
   next();
 });
 
 exports.restrictTo = (...roles) => {
   return async (req, res, next) => {
     const userRole = req.user.role;
     if (!roles.includes(userRole)) return next(
         new AppError('User not authorized to carry out this function.', 403),
       );
 
     next();
   };
 };