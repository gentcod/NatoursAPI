const fs = require('fs');

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);
const checkUser = (request) => users.find((el) => el._id === request.params.id);

exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
};

exports.createUser = (req, res) => {
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
        },
      });
    }
  );
};

exports.getUser = (req, res) => {
  const user = checkUser(req);

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    results: user.length,
    data: {
      user,
    },
  });
};

exports.updateUser = (req, res) => {
  const user = checkUser(req);

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    tour: '<Updated tour>',
  });
};

exports.deleteUser = (req, res) => {
  const user = checkUser(req);

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
