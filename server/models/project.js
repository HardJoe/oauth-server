const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  client_id: {
    type: String,
    required: true,
    unique: true,
  },
  client_secret: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', ProjectSchema);
