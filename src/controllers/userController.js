const R = require('ramda');

const User = require('../models/user');

const createUser = async function (req, res) {
  const body = R.pick(['username', 'full_name', 'npm', 'password'], req.body);
  let user = new User(body);
  try {
    user = await user.save();
    res.status(201).send(R.pick(['username', 'full_name', 'npm'], user));
  } catch (e) {
    res.status(400).send({
      error: 'invalid request',
      error_description: e.message,
    });
  }
};

module.exports = { createUser };
