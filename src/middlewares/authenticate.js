const bcrypt = require('bcryptjs');

const User = require('../models/user');
const AccessToken = require('../models/accessToken');

var verifyAccessToken = async function (req, res, next) {
  try {
    const token = req.header('Authorization').split(' ')[1];

    const at = await AccessToken.findOne({ token });
    if (!at) {
      throw new Error();
    }

    const expiryTime = at.created_at.getTime() + 5 * 60 * 1000;
    const now = new Date().getTime();
    if (expiryTime < now) {
      throw new Error();
    }

    req.at = at;
    next();
  } catch {
    res.status(401).send({
      error: 'invalid_token',
      error_description: 'token salah masbro!',
    });
  }
};

const verifyUser = function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username })
    .then(function (user) {
      if (!user) {
        return Promise.reject();
      }
      return user;
    })
    .then(function (user) {
      return new Promise(function (resolve, reject) {
        bcrypt.compare(password, user.password, function (err, res) {
          if (res) {
            resolve(user);
          } else {
            reject();
          }
        });
      });
    })
    .then(function (user) {
      req.user = user;
      next();
    })
    .catch(function (e) {
      res.status(401).send({
        error: 'invalid_request',
        error_description: 'ada kesalahan masbro!',
      });
    });
};

module.exports = { verifyAccessToken, verifyUser };
