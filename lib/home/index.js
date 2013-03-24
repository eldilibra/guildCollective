var express = require('express');
var app = module.exports = express();

app.get('/home/:id', function (req, res) {
//  res.write('Hello, ' + req.params.id + '. Your results from Twitter:\n' + JSON.stringify(req.session.results, null, 2));
  res.render('home', { twitter_profile_image: req.session.twitter_pic });
  res.end();
});
