var express = require('express');
var app = module.exports = express();
var mongo = require('mongojs');
var db = mongo('mongodb://heroku:silver!3@arzt.mongohq.com:10063/app13872867');
var artists = db.collection('artists');

app.set('views', __dirname);
app.set('view engine', 'ejs');
app.use(express.bodyParser());
app.use(express.methodOverride());

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.artistData = function (username, callback) {
  artists.find({ username: username }, function findArtistCb (err, data) {
    if (err) throw err;
    if (data.length == 0) {
      callback(null, 'Artist not found');
      return;
    }
    callback(null, data);
  });
};

app.get('*', function checkSession(req, res, next) {
  if (!req.session.username) {
    res.redirect('/landing');
  }
  next();
});

app.get('/artists', function getArtistsCb (req, res) {
  res.write('Ecco e un elenco di artisti');
  res.end();
});

app.get('/artists/create/:username', function createUserCb (req, res) {
  res.render('create-artist', { username: req.params.username });
});

app.get('/artists/:username', function getArtistCb (req, res) {
  app.artistData(req.params.username, function (err, artist) {
    if (err) throw err;
    res.render('artist-page', { artist: artist[0] });
  });
});

app.post('/artists/:username', function postArtistCb (req, res) {
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
