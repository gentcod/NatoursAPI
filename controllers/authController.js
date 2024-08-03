const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const tokenGenerator = require('../utils/tokenGenerator');
const sendMail = require('../utils/mailer');

const cookieOptions = {
  expires: new Date(Date.now() + process.env.COOKIE_EXP * 60 * 60 * 60 * 1000),
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production' ? true : undefined,
}

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  //Payload, Secret and Options
  const token = tokenGenerator.signToken({ id: newUser._id });

  res.cookie('token', token, cookieOptions)

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(
      new AppError(
        'Email or password is incorrect, please check and try again',
        401,
      ),
    );

  const token = tokenGenerator.signToken({ id: user._id });

  res.cookie('token', token, cookieOptions)

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.find({ email: req.body.email });
  if (!user) {
    return next(new AppError('User does not exist', 404));
  }

  const token = tokenGenerator.signToken(
    { email: req.body.email },
    process.env.JWT_PASSWORD_EXPIRE,
  );

  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password?token=${token}`;

  const mailOptions = {
    recipient: req.body.email,
    subject: 'Natours Test',
    message: `Forgot password? Click on the following link to reset your password: ${resetUrl}.\nIf you
      didn't forget password, please ignore this email`,
  };

  await sendMail(mailOptions);

  res.status(200).json({
    status: 'success',
    message: 'Email to reset password has been sent successfully',
    resetUrl,
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const tokenData = await tokenGenerator.verify(req.body.token);
  console.log(tokenData);

  const user = await User.findOne({ email: tokenData.email });
  if (!user) {
    return next(new AppError('User does not exist', 404));
  }

  if (await user.correctPassword(req.body.newPassword, user.password))
    return next(
      new AppError(
        'Old password cannot be set as new password, please check and try again',
        403,
      ),
    );

  const newpasswordHash = await bcrypt.hash(req.body.newPassword, 12);
  await User.findByIdAndUpdate(
    user._id,
    {
      password: newpasswordHash,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
    message: 'Password has been changed successfully',
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.user.email }).select(
    '+password',
  );
  if (!(await user.correctPassword(req.body.password, user.password)))
    return next(
      new AppError(
        'Old password is incorrect, please check and try again',
        403,
      ),
    );

  if (await user.correctPassword(req.body.newPassword, user.password))
    return next(
      new AppError(
        'Old password cannot be set as new password, please check and try again',
        403,
      ),
    );

  const newpasswordHash = await bcrypt.hash(req.body.newPassword, 12);
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      password: newpasswordHash,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  const token = tokenGenerator.signToken({ id: updatedUser._id });

  res.status(200).json({
    status: 'success',
    message: 'Password has been changed successfully',
    data: {
      token,
    },
  });
});
