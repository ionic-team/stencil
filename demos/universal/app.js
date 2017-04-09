var express = require('express');
var app = express();
var ionicUniversal = require('../../dist/ionic-universal');


var ionic = ionicUniversal.init({});


app.get('/', function (req, res) {
  console.log('req.url:', req.url);

  var input = Math.random().toString();

  ionic.renderToString(input, (content) => {

    res.send(content);
  });
});


app.listen(3000, function () {
  console.log('app listening on port 3000!');
});
