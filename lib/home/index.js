var express = require('express');
var app = module.exports = express();

app.set('views', __dirname);
app.set('view engine', 'ejs');

app.get('*', function checkSession(req, res) {
  if (!req.session.username) {
    res.redirect('/landing');
  }
});

app.get('/home/:username', function (req, res) {
//  res.write('Hello, ' + req.params.id + '. Your results from Twitter:\n' + JSON.stringify(req.session.results, null, 2));
  res.render('home', { username: req.params.username });
});
