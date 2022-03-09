const Project = require('../models/project');

const findProject = function (req, res, next) {
  const client_id = req.body.client_id;
  Project.findOne({ client_id })
    .then(function (project) {
      if (!project) {
        return Promise.reject({
          code: 404,
          message: 'Project ID does not exist',
        });
      }
      req.project = project;
      next();
    })
    .catch(function (e) {
      if (e.code) {
        res.status(e.code).send(e);
      } else {
        res.status(500).send({ message: 'Unknown Error' });
      }
    });
};

module.exports = findProject;
