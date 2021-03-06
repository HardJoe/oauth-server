const bodyParser = require('body-parser');
const express = require('express');

const userRouter = require('./routes/userRoutes');
const projectRouter = require('./routes/projectRoutes');
const oAuthRouter = require('./routes/oAuthRoutes');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to OAuth Server "From Scratch" by HardJoe!');
});
app.use('/user', userRouter);
app.use('/project', projectRouter);
app.use('/oauth', oAuthRouter);

module.exports = app;
