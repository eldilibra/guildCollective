var mongo = require('mongojs');
var db = mongo('mongodb://heroku:silver!3@arzt.mongohq.com:10063/app13872867');
var artists = db.collection('artists');
var pieces = db.collection('pieces');
var async = require('async');
var count = 0;

artists.find({}, { username: 1, fullName: 1 }, function (err, aDocs) {
  async.eachSeries(aDocs, function (doc, cb) {
    ++count;
    console.log(count + ': http://guildcollective.heroku.com/artists/' + doc.username + ' : ' + doc.fullName);
    cb();
  }, function (err) {

    pieces.find({}, { username: 1, titleSlug: 1}, function (err, pDocs) {
      async.eachSeries(pDocs, function (pDoc, cb) {
        artists.find({ username: pDoc.username }, { fullName: 1 }, function (err, arDoc) {
          if (arDoc && arDoc.length > 0) {
            ++count;
            console.log(count + ': http://guildcollective.heroku.com/pieces/' + pDoc.username + '/' + pDoc.titleSlug + ' : ' + arDoc[0].fullName);
          } else {
            console.log('prollum');
          }
          cb();
        });
      }, function (err) {
        process.exit();
      });
    });
  });
});
