var express = require('express');
var app = module.exports = express();
var mongo = require('mongojs');
var db = mongo('mongodb://heroku:silver!3@arzt.mongohq.com:10063/app13872867');
var artists = db.collection('artists');

app.artistData = function (username, callback) {
  artists.find({ username: username }, function (err, data) {
    if (err) throw err;
    if (data.length == 0) {
      callback(null, 'Artist not found');
    }
    callback(null, data);
  });
};

app.get('/artists', function (req, res) {
  res.write('Ecco e un elenco di utenti');
  res.end();
});

app.get('/artists/create/:username', function (req, res) {
  res.render('create-artist', { username: req.params.username });
});

app.post('/artists/:username', function (req, res) {
  var artist = {
    username: req.params.username,
    fullName: req.body.fullName || '',
    hometown: req.body.hometown || '',
    guild: req.body.guild,
    bio: req.body.bio
  };
  artists.save(artist, function (err, result) {
    if (err) throw err;
    console.log(result);
    res.end();
  });
});
