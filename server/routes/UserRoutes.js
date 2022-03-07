const express = require('express');
const R = require('ramda');

const User = require('../models/user');

const router = express.Router();

router.route('/register').post(function (req, res) {
  var body = R.pick(['username', 'full_name', 'npm', 'password'], req.body);
  var user = new User(body);
  user
    .save()
    .then(function () {
      res.status(201).send(R.pick(['username', 'full_name', 'npm'], user));
    })
    .catch(function (e) {
      console.log(e);
      res.status(400).send({ code: 400, message: e });
    });
});

module.exports = router;
