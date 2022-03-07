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
  access_tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  refresh_tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.methods.generateAccessToken = function () {
  var user = this;
  const accessToken = crypto.randomBytes(20).toString('hex');
  user.access_tokens.push({ token: accessToken });
  const refreshToken = crypto.randomBytes(20).toString('hex');
  user.refresh_tokens.push({ token: refreshToken });
  return user.save().then(function () {
    return { accessToken, refreshToken };
  });
};

UserSchema.statics.findByIdentity = function (userId, password) {
  var User = this;
  return User.findOne({ userId }).then(function (user) {
    if (!user) {
      return Promise.reject({ code: 400, message: 'Invalid Identity' });
    }
    return new Promise(function (resolve, reject) {
      bcrypt.compare(password, user.password, function (err, res) {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
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
