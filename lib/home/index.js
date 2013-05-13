var express = require('express');
var app = module.exports = express();

app.set('views', __dirname);
app.set('view engine', 'ejs');

app.get('/home/:username', function (req, res) {
  checkLoggedIn(req, res, function () {
    res.render('home', { username: req.params.username });
  });
});

function checkLoggedIn (req, res, callback) {
  if (!req.session.username) {
    res.redirect('/');
  }
  if (req.session.username === req.params.username) {
    return callback();
  }
  res.redirect('/home/' + req.session.username);
}
