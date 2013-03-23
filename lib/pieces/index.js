var express = require('express');
var app = module.exports = express();

app.get('/pieces', function (req, res) {
  res.write('Ecco e un elenco di opere d\'arte');
  res.end();
});
