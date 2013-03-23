var express = require('express');
var app = module.exports = express();

app.get('/home/:id', function (req, res) {
  res.write('Hello, ' + req.params.id);
  res.end();
});
