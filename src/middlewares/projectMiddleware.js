const Project = require('../models/project');

const verifyProject = function (req, res, next) {
  const client_id = req.body.client_id;
  const client_secret = req.body.client_secret;

  Project.findOne({ client_id })
    .then(function (project) {
      if (!project) {
        return Promise.reject();
      }
      return project;
    })
    .then(function (project) {
      if (client_secret != project.client_secret) {
        return Promise.reject();
      }
      return project;
    })
    .then(function (project) {
      req.project = project;
      next();
    })
    .catch(function (e) {
      res.status(401).send({
        error: 'invalid_request',
        error_description: 'ada kesalahan masbro!',
      });
    });
};

module.exports = { verifyProject };
