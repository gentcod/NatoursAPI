const jwt = require('jsonwebtoken');
const { promisify } = require('util');

exports.signToken = (payload, expiration) => {
  const exp = expiration ? expiration : process.env.JWT_EXPIRE;
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: exp,
  });
};

exports.verify = async (token) => {
  return promisify(jwt.verify)(token, process.env.JWT_SECRET);
};
