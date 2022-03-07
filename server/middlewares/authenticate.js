const User = require('../models/user');
/*
 * This function takes the x-auth token from header, validates it,
 * and finds the user by that.
 */
var verifyAuthToken = function (req, res, next) {
  var token = req.header('x-auth');
  console.log('token', token);
  User.findByToken(token, 'auth')
    .then(function (data) {
      if (!data.user) {
        return Promise.reject({ code: 401, message: 'Invalid X-Auth Token' });
      }
      req.user = data.user;
      req.token = token;
      next();
    })
    .catch(function (e) {
      if (e.code) {
        res.status(e.code).send(e);
      } else {
        console.log(e);
        res.status(500).send({ code: 500, message: 'Unknown Error' });
      }
    });
};
/*
 * This function takes the code token from query, validates it,
 * and matches it with project data.
 */
var verifyOAuthCode = function (req, res, next) {
  var token = req.query.code;
  User.findByToken(token, 'oauth')
    .then(function (data) {
      if (!data.user) {
        return Promise.reject({ code: 403, message: 'Invalid code' });
      }
      var project = req.project;
      var decoded = data.decoded;
      if (
        decoded.projectID != project.projectID ||
        decoded.projectSecret != project.projectSecret ||
        decoded.scope != project.scope
      ) {
        return res.status(400).send({
          code: 403,
          message: 'The code does not belong to the project',
        });
      }
      req.user = data.user;
      req.decoded = decoded;
      req.token = token;
      next();
    })
    .catch(function (e) {
      if (e && e.code) {
        res.status(e.code).send(e);
      } else {
        console.log(e);
        res.status(500).send({ code: 500, message: 'Unknown Error' });
      }
    });
};
/*
 * This function takes the access_token token from query, validates it,
 * and find the user to which it belongs.
 */
var verifyAccessToken = function (req, res, next) {
  const token = req.header('Authorization').split(' ')[1];

  User.findByToken(token)
    .then(function (data) {
      if (!data.user) {
        return Promise.reject({ code: 403, message: 'Invalid Access Token' });
      }
      req.user = data.user;
      req.token = token;
      next();
    })
    .catch(function (e) {
      if (e.code) {
        res.status(e.code).send(e);
      } else {
        console.log(e);
        res.status(500).send({ code: 500, message: 'Unknown Error' });
      }
    });
};

module.exports = { verifyAccessToken, verifyAuthToken, verifyOAuthCode };
