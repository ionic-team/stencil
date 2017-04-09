var express = require('express');
var app = express();
var ionicServer = require('../../dist/ionic-server');


app.get('/', function (req, res) {
  console.log('req.url:', req.url);

  var content = ionicServer.renderToString(Math.random().toString());

  res.send(content);
});


app.listen(3000, function () {
  console.log('app listening on port 3000!');
});
