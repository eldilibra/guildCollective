var express = require('express');
var app = module.exports = express();

app.get('/users', function (req, res) {
  res.write('Ecco e un elenco di utenti');
  res.end();
});
