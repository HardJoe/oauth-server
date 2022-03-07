const express = require('express');
const R = require('ramda');

const projectMiddleware = require('../middlewares/projectMiddleware');
const {
  verifyAccessToken,
  verifyAuthToken,
  verifyOAuthCode,
} = require('../middlewares/authenticate');
const User = require('../models/user');

const router = express.Router();

router.route('/token').post(projectMiddleware, async function (req, res) {
  if (req.project.client_secret != req.body.client_secret) {
    return res
      .status(400)
      .send({ code: 400, message: 'Mismatch clientID and Secret' });
  }
  var body = R.pick(['username', 'password'], req.body);
  try {
    var user = await User.findByIdentity(body.username, body.password);
  } catch (e) {
    console.log(e);
    res.status(400).send({ code: 400, message: e });
  }

  user
    .generateAccessToken()
    .then(({ accessToken, refreshToken }) => {
      res.send({
        access_token: accessToken,
        expires_in: 300,
        token_type: 'Bearer',
        scope: null,
        refresh_token: refreshToken,
      });
    })
    .catch((e) => {
      console.log('e', e);
      res.status(400).send({ message: 'Error while generating access token' });
    });
});

module.exports = router;
