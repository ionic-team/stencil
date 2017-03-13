var path = require('path');
var fs = require('fs');

var webDir = path.join('demos/web');


fs.readdir(webDir, (err, files) => {

  files.forEach(file => {
    var e2eDir = path.join(webDir, file);

    var stats = fs.statSync(e2eDir);
    if (!stats.isDirectory()) return;

    fs.readdir(e2eDir, (err, files) => {

      files.forEach(file => {
        var e2eSubDir = path.join(e2eDir, file);

        var stats = fs.statSync(e2eSubDir);
        if (!stats.isDirectory()) return;

        fs.readdir(e2eSubDir, (err, files) => {

          files.forEach(file => {
            var f = path.join(e2eSubDir, file);

            if (file === 'main.html') {
              var index = path.join(e2eSubDir, 'index.html');
              var mainContent = fs.readFileSync(f).toString();

              createIndex(index, mainContent);
            }

          });

        });

      });

    });

  });

});


function createIndex(index, mainContent) {
  console.log(index);

  mainContent = mainContent.replace(/ item-left/g, ' slot="item-left"');
  mainContent = mainContent.replace(/ item-right/g, ' slot="item-right"');

  var content = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <title>Ionic</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="format-detection" content="telephone=no">
  <meta name="msapplication-tap-highlight" content="no">
  <link href="/dist/themes/ionic.css" rel="stylesheet">
  <script src="/dist/ionic-web/dist/ionic.web.js" static-dir="/dist/ionic-web/dist/"></script>
</head>
<body>

  <ion-app>

<!-- main start -->

${mainContent}

<!-- main end -->

  </ion-app>

</body>
</html>`;


  fs.writeFileSync(index, content);

}
