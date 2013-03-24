var request = require('request');
var express = require('express');
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
  res.render('landing');
});

app.get('/auth/twitter', function(req, res){
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

app.get('/auth/twitter/callback', function(req, res, next){
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
        request('http://api.twitter.com/1.1/users/show.json?screen_name=' + results.screen_name, function (err, twitterRes) {
          console.log(JSON.stringify(twitterRes, null, 2));
          req.session.twitter_pic = twitterRes.profile_image_url;
          res.redirect('/home/' + results.screen_name);
        });
      }
    }
    );
  } else
    next(new Error("you're not supposed to be here."))
});
