var express = require('express');
var app = module.exports = express();

app.set('views', __dirname);
app.set('view engine', 'ejs');

app.get('/home/:id', function (req, res) {
//  res.write('Hello, ' + req.params.id + '. Your results from Twitter:\n' + JSON.stringify(req.session.results, null, 2));
  res.render('home', { username: req.params.id });
});
