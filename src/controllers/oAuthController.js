const crypto = require('crypto');

const User = require('../models/user');
const AccessToken = require('../models/accessToken');
const RefreshToken = require('../models/refreshToken');

const generateToken = async function (req, res) {
  try {
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

    res.send({
      access_token: at.token,
      expires_in: 300,
      token_type: 'Bearer',
      scope: at.scope,
      refresh_token: rt.token,
    });
  } catch {
    res.status(401).send({
      error: 'invalid_request',
      error_description: 'ada kesalahan masbro!',
    });
  }
};

const getResource = async function (req, res) {
  const at = req.at;
  const user = await User.findOne({ username: at.username });
  const refreshToken = new RefreshToken({
    token: crypto.randomBytes(20).toString('hex'),
    client_id: at.client_id,
    username: at.username,
  });
  const rt = await refreshToken.save();

  res.send({
    access_token: at.token,
    client_id: at.client_id,
    user_id: at.username,
    full_name: user.full_name,
    npm: user.npm,
    expires: null,
    token_type: 'Bearer',
    refresh_token: rt.token,
  });
};

module.exports = { generateToken, getResource };
