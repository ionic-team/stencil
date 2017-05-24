var express = require('express');
var app = express();
var ionicUniversal = require('../../dist/ionic-universal');
var fs = require('fs');
var path = require('path');


var ionicServerConfig = {
  staticDir: path.join('../../dist/ionic-web')
}

console.log('load components from:', ionicServerConfig.staticDir);


var ionic = ionicUniversal.init(ionicServerConfig);


app.get('/', function (req, res) {
  console.log(`serve: ${req.url}`);

  var filePath = path.join(__dirname, '../vanilla/index.html');

  fs.readFile(filePath, 'utf-8', (err, html) => {
    if (err) {
      console.error(err);
      res.send(err);
      return;
    }

    var opts = {
      req: req
    };

    ionic.hydrate(html, opts).then(upgradedHtml => {
      res.send(upgradedHtml);

    }).catch(err => {
      res.send(err.toString() + err.stack && err.stack.toString());
    });
  });

});


app.listen(3000, () => {
  console.log('app listening on port 3000!');
});
