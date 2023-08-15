const fs = require('fs');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);
const checkUser = (request) => users.find((el) => el._id === request.params.id);

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.createUser = catchAsync((req, res) => {
  const newId = 1;
  const newUser = Object.assign({ id: newId }, req.body);

  users.push(newUser);
  fs.writeFile(
    `${__dirname}/../dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          users: newUser,
          errorCode: err,
        },
      });
    }
  );
});

exports.getUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) return new AppError('Invalid ID', 404);
  
  res.status(200).json({
    status: 'success',
    results: user.length,
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  const user = checkUser(req);

  if (!user) return new AppError('Invalid ID', 404);

  res.status(200).json({
    status: 'success',
    tour: '<Updated tour>',
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const user = checkUser(req);

  if (!user) return new AppError('Invalid ID', 404);
 
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
