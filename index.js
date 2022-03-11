require('dotenv').config();

const http = require('http');

const app = require('./server/app');
const mongoose = require('./server/db/connectDb');

const server = http.createServer(app);

const port = process.env.PORT;
server.listen(port, '0.0.0.0', function () {
  console.log('Server running at port ' + port);
});
