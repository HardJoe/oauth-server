require('dotenv').config({ path: './.env' });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  full_name: {
    type: String,
    required: true,
    trim: true,
  },
  npm: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  created_at: { type: Date, default: Date.now },
});

UserSchema.methods.generateAccessToken = function (client_id) {
  var user = this;
  const accessToken = crypto.randomBytes(20).toString('hex');
  user.access_tokens.push({
    token: accessToken,
    client_id,
    expires: new Date(Date.now + 5 * 60000),
  });
  const refreshToken = crypto.randomBytes(20).toString('hex');
  user.access_tokens.push({
    token: refreshToken,
    client_id,
    expires: new Date(Date.now + 30 * 60000),
  });
  return user.save().then(function () {
    return { accessToken, refreshToken };
  });
};

UserSchema.statics.findByToken = async function (token) {
  var User = this;
  const user = await User.findOne({
    'access_tokens.token': token,
  });
  return { user };
};

UserSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(user.password, salt, function (err, hash) {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.methods.removeToken = function (token) {
  var user = this;
  return user.updateOne({
    $pull: {
      access_tokens: { token },
    },
  });
};

module.exports = mongoose.model('User', UserSchema);
