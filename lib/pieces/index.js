var express = require('express');
var app = module.exports = express();
var mongo = require('mongojs');
var db = mongo('mongodb://heroku:silver!3@arzt.mongohq.com:10063/app13872867');
var pieces = db.collection('pieces');

app.set('views', __dirname);
app.set('view engine', 'ejs');
app.use(express.bodyParser());
app.use(express.methodOverride());

app.configure(function configure (){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.piecesData = function piecesData (username, pieceTitleSlug, callback) {
  var params = {
    username: username
  };
  // handle 2 parameter call
  if (!callback) {
    callback = pieceTitleSlug;
    pieceTitleSlug = null;
  }

  if (pieceTitleSlug) {
    params.titleSlug = pieceTitleSlug;
  }

  pieces.find(params, function findPieceCb (err, data) {
    if (err) throw err;
    if (data.length == 0) {
      callback(null, 'No pieces found');
      return;
    }
    callback(null, data);
  });
};

app.get('*', function checkSession(req, res) {
  if (!req.session.username) {
    res.redirect('/landing');
  }
});

app.get('/pieces', function getArtistsCb (req, res) {
  res.write('Ecco e un elenco di opere d\'arte');
  res.end();
});

app.get('/pieces/create/:username', function createPieceCb (req, res) {
  res.render('create-piece', { username: req.params.username });
});

app.get('/pieces/:username', function getPiecesCb (req, res) {
  app.piecesData(req.params.username, function (err, pieces) {
    if (err) throw err;
    res.render('pieces-page', { pieces: pieces });
  });
});

app.get('/pieces/:username/:titleSlug', function getPieceCb (req, res) {
  app.piecesData(req.params.username, req.params.titleSlug, function (err, piece) {
    if (err) throw err;
    res.render('piece-page', { piece: piece[0] });
  });
});

app.post('/pieces/:username', function postPieceCb (req, res) {
  var piece = {
    username: req.params.username,
    title: req.body.title,
    titleSlug: req.body.title.toLowerCase().replace(/ /g, '-'),
    piecePic: req.body.piecePic,
    creationDate: req.body.creationDate,
    medium: req.body.medium,
    description: req.body.description
  };
  pieces.save(piece, function savePieceCb(err, result) {
    if (err) throw err;
    res.redirect('/home/' + req.params.username);
  });
});
