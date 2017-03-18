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
  mainContent = mainContent.replace(/ item-left/gi, ' slot="item-left"');
  mainContent = mainContent.replace(/ item-right/gi, ' slot="item-right"');

  var oldText;
  var newText;

  while ((oldText = tagFinder(mainContent, 'button', ['ion-button', 'ion-item']))) {
    newText = oldText;

    if (oldText.indexOf(' ion-item') > -1) {
      newText = newText.replace(/<button/gi, '<ion-item');
      newText = newText.replace(/<\/button>/gi, '</ion-item>');
      newText = newText.replace(/ ion-item>/gi, '>');
      newText = newText.replace(/ ion-item /gi, ' ');

    } else {
      newText = newText.replace(/<button/gi, '<ion-button');
      newText = newText.replace(/<\/button>/gi, '</ion-button>');
      newText = newText.replace(/ ion-button>/gi, '>');
      newText = newText.replace(/ ion-button /gi, ' ');
    }

    mainContent = mainContent.replace(oldText, newText);
  }

  while ((oldText = tagFinder(mainContent, 'a', ['ion-button', 'ion-item']))) {
    newText = oldText;

    if (oldText.indexOf(' ion-item') > -1) {
      newText = newText.replace(/<a/gi, '<ion-item');
      newText = newText.replace(/<\/a>/gi, '</ion-item>');
      newText = newText.replace(/ ion-item>/gi, '>');
      newText = newText.replace(/ ion-item /gi, ' ');

    } else {
      newText = newText.replace(/<a/gi, '<ion-button');
      newText = newText.replace(/<\/a>/gi, '</ion-button>');
      newText = newText.replace(/ ion-button>/gi, '>');
      newText = newText.replace(/ ion-button /gi, ' ');
    }

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
  <link href="/dist/ionic-web/ionic.css" rel="stylesheet">
</head>
<body>

  <ion-app>

<!-- main start -->

${mainContent}

<!-- main end -->

  </ion-app>

  <script src="/dist/ionic-web/ionic.js" data-static-dir="/dist/ionic-web/"></script>

</body>
</html>`;


  fs.writeFileSync(index, content);

}


function tagFinder(content, tag, attrs) {
  var searchContent;

  while (content) {
    var startIndex = content.indexOf('<' + tag);
    if (startIndex === -1) return null;

    content = content.substr(startIndex);

    var endIndex = content.indexOf('</' + tag + '>');
    if (endIndex === -1) return null;

    searchContent = content.substr(0, endIndex + ('</' + tag + '>').length);
    content = content.substr(endIndex + ('</' + tag + '>').length);

    for (var i = 0; i < attrs.length; i++) {
      if (searchContent.indexOf(attrs[i]) > -1) {
        return searchContent;
      }
    }
  }

  return null;
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
