const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var AccessTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expires: {
    type: Date,
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
});

module.exports = mongoose.model('AccessToken', AccessTokenSchema);
