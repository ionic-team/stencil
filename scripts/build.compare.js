var path = require('path');
var fs = require('fs');


function buildWebDemos() {
  var data = {};
  var rootDir = path.join('demos/web');

  fs.readdirSync(rootDir).forEach(file => {
    var e2eDir = path.join(rootDir, file);

    var stats = fs.statSync(e2eDir);
    if (!stats.isDirectory()) return;

    fs.readdirSync(e2eDir).forEach(file => {
      var e2eSubDir = path.join(e2eDir, file);

      var stats = fs.statSync(e2eSubDir);
      if (!stats.isDirectory()) return;

      fs.readdirSync(e2eSubDir).forEach(file => {
        var f = path.join(e2eSubDir, file);

        if (file === 'main.html') {
          var index = path.join(e2eSubDir, 'index.html');
          var mainContent = fs.readFileSync(f).toString();

          createWebIndex(index, mainContent);

          data[index.replace(rootDir, '')] = true;
        }

      });

    });

  });

  var data = `var compareData = ${JSON.stringify(data, null, 2)};`

  fs.writeFileSync('demos/compare/web.js', data);
}


function createWebIndex(index, mainContent) {
  mainContent = mainContent.replace(/ item-left/g, ' slot="item-left"');
  mainContent = mainContent.replace(/ item-right/g, ' slot="item-right"');

  var match;
  var oldText;
  var newText;
  while ((match = mainContent.match(/<button(.*)ion-button(.*)([\s\S]*?)<\/button>/m))) {
    oldText = match[0];
    newText = oldText.replace('<button', '<ion-button');
    newText = newText.replace('</button>', '</ion-button>');
    newText = newText.replace(' ion-button>', '>');
    newText = newText.replace(' ion-button ', ' ');
    mainContent = mainContent.replace(oldText, newText);
  }

  while ((match = mainContent.match(/<a(.*)ion-button(.*)([\s\S]*?)<\/a>/m))) {
    oldText = match[0];
    newText = oldText.replace('<a', '<ion-button');
    newText = newText.replace('</a>', '</ion-button>');
    newText = newText.replace(' ion-button>', '>');
    newText = newText.replace(' ion-button ', ' ');
    mainContent = mainContent.replace(oldText, newText);
  }

  while ((match = mainContent.match(/<button(.*)ion-item(.*)([\s\S]*?)<\/button>/m))) {
    oldText = match[0];
    newText = oldText.replace('<button', '<ion-item');
    newText = newText.replace('</button>', '</ion-item>');
    newText = newText.replace(' ion-item>', '>');
    newText = newText.replace(' ion-item ', ' ');
    mainContent = mainContent.replace(oldText, newText);
  }

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


function buildIonic2Compare() {
  var data = {};
  var rootDir = path.join('demos/ionic2');

  fs.readdirSync(rootDir).forEach(file => {
    var e2eDir = path.join(rootDir, file);

    var stats = fs.statSync(e2eDir);
    if (!stats.isDirectory()) return;

    fs.readdirSync(e2eDir).forEach(file => {
      var e2eSubDir = path.join(e2eDir, file);

      var stats = fs.statSync(e2eSubDir);
      if (!stats.isDirectory()) return;

      fs.readdirSync(e2eSubDir).forEach(file => {
        var f = path.join(e2eSubDir, file);

        if (file === 'index.html') {
          var index = path.join(e2eSubDir, 'index.html');

          data[index.replace(rootDir, '')] = true;
        }

      });

    });

  });

  var data = `var ionic2Data = ${JSON.stringify(data, null, 2)};`

  fs.writeFileSync('demos/compare/ionic2.js', data);
}


buildWebDemos();
buildIonic2Compare();
