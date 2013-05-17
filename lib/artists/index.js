var express = require('express');
var app = module.exports = express();
var mongo = require('mongojs');
var db = mongo('mongodb://heroku:silver!3@arzt.mongohq.com:10063/app13872867');
var artists = db.collection('artists');
var getPieces = require('../pieces').piecesData;

app.set('views', __dirname);
app.set('view engine', 'ejs');
app.use(express.bodyParser());
app.use(express.methodOverride());

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.artistsData = function artistsData (username, callback) {
  var params = {};
  if (callback) {
    params.username = username;
  } else {
    callback = username;
  }
  artists.find(params, function findArtistCb (err, data) {
    if (err) throw err;
    if (data.length == 0) {
      callback(null, 'Artist not found');
      return;
    }
    callback(null, data);
  });
};

app.get('/artists', function getArtistsCb (req, res) {
  app.artistsData(function (err, allArtists) {
    res.render('all-artists-page', { artists: allArtists });
  });
});

app.get('/artists/create/:username', function createUserCb (req, res) {
  checkLoggedIn(req, res, function () {
    res.render('create-artist', { username: req.params.username });
  });
});

app.get('/artists/:username', function getArtistCb (req, res) {
  app.artistsData(req.params.username, function (err, artist) {
    if (err) throw err;
    getPieces(req.params.username, function (err, artPieces) {
      if (err) throw err;
      res.render('artist-page', { artist: artist[0], pieces: artPieces });
    });
  });
});

app.post('/artists/:username', function postArtistCb (req, res) {
  checkLoggedIn(req, res, function () {
    var artist = {
      username: req.params.username,
      fullName: req.body.fullName || '',
      hometown: req.body.hometown || '',
      guild: req.body.guild,
      bio: req.body.bio,
      profilePic: 'https://api.twitter.com/1/users/profile_image?screen_name=' + req.params.username + '&size=original'
    };
    artists.save(artist, function saveArtistCb(err, result) {
      if (err) throw err;
      res.redirect('/home/' + req.params.username);
    });
  });
});

function checkLoggedIn (req, res, callback) {
  if (!req.session.username) {
    res.redirect('/');
  }
  if (req.session.username !== req.params.username) {
    res.redirect('/home/' + req.session.username);
  }
  callback();
}
