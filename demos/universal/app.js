var express = require('express');
var app = express();
var ionicUniversal = require('../../dist/ionic-universal');


var ionic = ionicUniversal.init({});


app.get('/', function (req, res) {
  console.log('req.url:', req.url);

  var input = '<div>hi</div><ion-badge>88</ion-badge><span>yo</span><!--comment-->';

  ionic.upgradeHtml(input).then(function(html) {

    res.send(html);
  });

});


app.listen(3000, function () {
  console.log('app listening on port 3000!');
});
