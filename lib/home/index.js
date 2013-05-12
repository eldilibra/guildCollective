var express = require('express');
var app = module.exports = express();

app.set('views', __dirname);
app.set('view engine', 'ejs');

app.get('*', function checkSession(req, res, next) {
  if (!req.session.username) {
    res.redirect('/landing');
  }
  next();
});

app.get('/home/:username', function (req, res) {
  checkLoggedIn(req, res, function () {
    res.render('home', { username: req.params.username });
  });
});

function checkLoggedIn (req, res, callback) {
  if (req.session.username !== req.params.username) {
    res.redirect('/home/' + req.session.username);
  }
  callback();
}
