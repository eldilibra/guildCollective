
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();
var landing = require('./lib/landing');
var home = require('./lib/home');
var artists = require('./lib/artists');
var pieces = require('./lib/pieces');

var HALF_HOUR = 1000 * 60 * 30;

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('vulfgong'));
  app.use(express.session({ secret: '18moboglobiobe19', cookie: { maxAge: HALF_HOUR }}));
  app.use(app.router);
  app.use(landing);
  app.use(home);
  app.use(artists);
  app.use(pieces);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
