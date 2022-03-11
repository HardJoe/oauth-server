const crypto = require('crypto');
const R = require('ramda');

const Project = require('../models/project');

const createProject = async function (req, res) {
  const body = R.pick(['name'], req.body);

  body.client_id = crypto.randomBytes(16).toString('hex');

  const hash = crypto
    .createHmac('sha256', process.env.SECRET)
    .update(body.client_id)
    .digest('hex');
  body.client_secret = hash;

  let project = new Project(body);
  try {
    project = await project.save();
    res
      .status(201)
      .send(R.pick(['name', 'client_id', 'client_secret'], project));
  } catch (e) {
    res.status(400).send({
      error: 'invalid request',
      error_description: e.message,
    });
  }
};

module.exports = { createProject };
