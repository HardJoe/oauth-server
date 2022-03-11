const crypto = require('crypto');

const User = require('../models/user');
const AccessToken = require('../models/accessToken');
const RefreshToken = require('../models/refreshToken');

const generateToken = async function (req, res) {
  try {
    const refreshToken = new RefreshToken({
      token: crypto.randomBytes(20).toString('hex'),
      client_id: req.body.client_id,
      username: req.body.username,
    });
    const rt = await refreshToken.save();

    const accessToken = new AccessToken({
      token: crypto.randomBytes(20).toString('hex'),
      client_id: req.body.client_id,
      username: req.body.username,
      refresh_token: rt.token,
    });
    const at = await accessToken.save();

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
  try {
    const at = req.at;
    const user = await User.findOne({ username: at.username });

    res.send({
      access_token: at.token,
      client_id: at.client_id,
      user_id: at.username,
      full_name: user.full_name,
      npm: user.npm,
      expires: at.scope,
      token_type: 'Bearer',
      refresh_token: at.refresh_token,
    });
  } catch {
    res.status(401).send({
      error: 'invalid_request',
      error_description: 'token salah masbro!',
    });
  }
};

module.exports = { generateToken, getResource };
