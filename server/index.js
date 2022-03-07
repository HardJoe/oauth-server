require('dotenv').config({ path: './.env' });

const app = require('./app');
const http = require('http');
const mongoose = require('./db/connectDB');

const server = http.createServer(app);

const port = process.env.PORT;
server.listen(port, function () {
  console.log('Server running at port ' + port);
});
