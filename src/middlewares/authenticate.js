const bcrypt = require('bcryptjs');

const User = require('../models/user');
const AccessToken = require('../models/accessToken');

const verifyUser = async function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error();
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      req.user = user;
      next();
    } else {
      throw new Error();
    }
  } catch (e) {
    res.status(401).send({
      error: 'invalid_request',
      error_description: 'ada kesalahan masbro!',
    });
  }
};

const verifyAccessToken = async function (req, res, next) {
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

module.exports = { verifyAccessToken, verifyUser };
