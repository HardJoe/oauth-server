const express = require('express');
const R = require('ramda');
const crypto = require('crypto');

const { verifyProject } = require('../middlewares/projectMiddleware');
const {
  verifyAccessToken,
  verifyUser,
} = require('../middlewares/authenticate');
const AccessToken = require('../models/accessToken');
const RefreshToken = require('../models/refreshToken');

const router = express.Router();

router
  .route('/token')
  .post([verifyUser, verifyProject], async function (req, res) {
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
