
/**
 * Module dependencies.
 */

var express = require('express')
  , lib = require('./lib')
  , http = require('http')
  , path = require('path');

var app = express();
var landing = require('./lib/landingPage');
var users = require('./lib/users');
var pieces = require('./lib/pieces');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(landing);
  app.use(users);
  app.use(pieces);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function (req, res) {
  res.redirect('/landing');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
