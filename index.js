const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
var http = require('http');
var main = require('main');

var app = express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use('/', main);

app.set('port', PORT);

var server = http.createServer(app);

server.listen(PORT);

module.exports(app);
