var request = require('request');
var express = require('express');
var getArtist = require('../artists').artistData;
var app = module.exports = express();
var OAuth= require('oauth').OAuth;
var oa = new OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  "aSWtWevPBqtjQHmBvkRrnQ",
  "dqOv2CHCmA9evMFchIe8bMVglcO9uKy5J3gZ1SZz9E",
  "1.0",
  "http://pacific-gorge-7508.herokuapp.com/auth/twitter/callback",
  "HMAC-SHA1"
);

app.set('views', __dirname);
app.set('view engine', 'ejs');

app.get('/landing', function (req, res) {
  if (req.session.username) {
    return res.redirect('/home/' + req.session.username);
  }
  res.render('landing');
});

app.get('/auth/twitter', function(req, res) {
  if (process.env.NODE_ENV == 'development') {
    console.log('made it!');
    return getArtist('ldlibra', function (err, data) {
      if (err) throw err;
      console.log(data);
      if (data == 'Artist not found') {
        res.redirect('/artists/create/ldlibra');
      } else {
        res.redirect('/home/' + data[0].username);
      }
    });
  }
  if (req.session.username) {
    getArtist(req.session.username, function (err, data) {
      if (err) throw err;
      console.log(data);
      if (data == 'Artist not found') {
        return res.redirect('/artists/create/' + req.session.username);
      } else {
        return res.redirect('/home/' + data[0].username);
      }
    });
  }
  oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
    if (error) {
      console.log(error);
      res.write("yeah no. didn't work.")
      res.end();
    }
    else {
      req.session.oauth = {};
      req.session.oauth.token = oauth_token;
      console.log('oauth.token: ' + req.session.oauth.token);
      req.session.oauth.token_secret = oauth_token_secret;
      console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
      res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
    }
  });
});

app.get('/auth/twitter/callback', function(req, res, next) {
  if (req.session.oauth) {
    req.session.oauth.verifier = req.query.oauth_verifier;
    var oauth = req.session.oauth;

    oa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier,
    function(error, oauth_access_token, oauth_access_token_secret, results){
      if (error){
        console.log(error);
        res.write("yeah something broke.");
        res.end();
      } else {
        req.session.oauth.access_token = oauth_access_token;
        req.session.oauth.access_token_secret = oauth_access_token_secret;
        req.session.username = results.screen_name;
        getArtist(req.session.username, function (err, data) {
          if (err) throw err;
          console.log(data);
          if (data == 'Artist not found') {
            res.redirect('/artists/create/' + req.session.username);
          } else {
            res.redirect('/home/' + data[0].username);
          }
        });
      }
    });
  } else
    next(new Error("you're not supposed to be here."))
});
