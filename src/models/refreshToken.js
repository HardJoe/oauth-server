const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var RefreshTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  client_id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  scope: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
