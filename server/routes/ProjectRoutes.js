const express = require('express');
const crypto = require('crypto');
const R = require('ramda');

const Project = require('../models/project');

const router = express.Router();

router.route('/').post(async function (req, res) {
  var data = R.pick(['name'], req.body);
  data.client_id = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .createHmac('sha256', process.env.SECRET)
    .update(data.client_id)
    .digest('hex');
  data.client_secret = hash;
  var project = new Project(data);
  try {
    var project = await project.save();
    res
      .status(201)
      .send(R.pick(['name', 'client_id', 'client_secret'], project));
  } catch (e) {
    console.log(e);
    res.status(406).send({ code: 406, message: 'Retry with different name' });
  }
});

module.exports = router;
