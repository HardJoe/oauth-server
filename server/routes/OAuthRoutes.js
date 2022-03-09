const express = require('express');
const R = require('ramda');
const crypto = require('crypto');

const findProject = require('../middlewares/projectMiddleware');
const {
  verifyAccessToken,
  verifyUser,
} = require('../middlewares/authenticate');
const User = require('../models/user');
const AccessToken = require('../models/accessToken');
const RefreshToken = require('../models/refreshToken');

const router = express.Router();

router
  .route('/token')
  .post([verifyUser, findProject], async function (req, res) {
    if (req.project.client_secret != req.body.client_secret) {
      return res
        .status(401)
        .send({ code: 401, message: 'Mismatch client_id and client_secret' });
    }
    // var body = R.pick(['username', 'password'], req.body);
    // try {
    //   var user = await User.findByCredentials(body.username, body.password);
    //   console.log('user', user);
    // } catch (e) {
    //   console.log(e);
    // }

    const accessToken = new AccessToken({
      token: crypto.randomBytes(20).toString('hex'),
      client_id: req.body.client_id,
      username: req.body.username,
    });
    const refreshToken = new RefreshToken({
      token: crypto.randomBytes(20).toString('hex'),
      client_id: req.body.client_id,
      username: req.body.username,
    });

    const at = await accessToken.save();
    const rt = await refreshToken.save();

    console.log('at', at);

    res.send({
      access_token: at.token,
      expires_in: 300,
      token_type: 'Bearer',
      scope: null,
      refresh_token: rt.token,
    });
  });

router.route('/resource').post(verifyAccessToken, async function (req, res) {
  user = req.user;

  res.send({
    access_token: req.token,
    client_id: null,
    user_id: user.username,
    full_name: user.full_name,
    npm: user.npm,
    expires: null,
    token_type: 'Bearer',
    refresh_token: user.refresh_tokens[user.refresh_tokens.length - 1].token,
  });
});

module.exports = router;
