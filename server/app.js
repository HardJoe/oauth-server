const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');

const userRouter = require('./routes/UserRoutes');
const projectRouter = require('./routes/ProjectRoutes');
const OAuthRouter = require('./routes/OAuthRoutes');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Expose-Headers', 'x-auth');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With,content-type, Accept , x-auth'
  );

  next();
});

app.use('/user', userRouter);
app.use('/project', projectRouter);
app.use('/oauth', OAuthRouter);

module.exports = app;
