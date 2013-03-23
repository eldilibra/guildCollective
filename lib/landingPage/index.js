var express = require('express');
var app = module.exports = express();

app.get('/landing', function (req, res) {
  res.write('Questo e una bella pagina di atterraggio');
  res.end();
});
