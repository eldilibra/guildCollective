var express = require('express');
var app = module.exports = express();

app.set('views', __dirname);
app.set('view engine', 'ejs');

app.get('/landing', function (req, res) {
  res.render('landing');
});
