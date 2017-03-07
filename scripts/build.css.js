var path = require('path');
var glob = require("glob");
var fs = require('fs-extra');
var sass = require('node-sass');


function setCss(fileSearch) {
  glob(fileSearch, (err, files) => {
    const promises = files.map(filename => {
      return setFileCss(filename);
    });
    Promise.all(promises).then(() => {
      console.log('sass done');
    });
  });
}


function setFileCss(filename) {

  return new Promise((resolve, reject) => {

    var content = fs.readFile(filename, (err, content) => {
      if (err) {
        console.log(err);
        reject();
        return;
      }

      var classMatch = content.toString().match(/export class (.*?) extends IonElement/);
      if (!classMatch) {
        resolve();
        return;
      }

      var className = classMatch[1];

      buildCss(filename, content, className).then(() => {
        resolve();
      });
    });

  });
}


function buildCss(filename, content, className) {
  return new Promise(resolve => {

    const cssPrototype = `${className}.prototype['$css']`;

    if (content.indexOf(cssPrototype) > -1) {
      resolve();
      return;
    }

    //  /Users/adam/git/ionic-next/dist/transpiled-core/components/app/*.scss

    var sassFilename = filename.replace('/dist/transpiled-core/', '/src/');
    sassFilename = sassFilename.replace('/dist/transpiled-web/', '/src/');
    var scssSearch = path.join(path.dirname(sassFilename), '*.scss');

    glob(scssSearch, (err, sassImports) => {

      if (!sassImports.length) {
        resolve();
        return;
      }

      sassImports = sassImports.sort((a, b) => {
        if (a.length < b.length) {
          return -1;
        }
        if (a.length > b.length) {
          return 1;
        }
        return 0;
      });


      render(sassImports).then(cssOutput => {
        content += `${cssPrototype} = '${cssOutput}';`;

        fs.writeFile(filename, content, (err) => {
          resolve();
        });
      })
    });
  });
}


function render(sassImports) {
  return new Promise((resolve, reject) => {

    var sassConfig = {
      data: '@charset "UTF-8"; @import "' + sassImports.join('","') + '";',
      outputStyle: 'compressed'
    };

    sass.render(sassConfig, (err, result) => {
      if (err) {
        console.log(err);
        reject();

      } else {
        const cssOutput = result.css.toString().trim();
        resolve(cssOutput);
      }
    });
  });
}


var componentsFileSearch = path.join(__dirname, '../dist/transpiled-core/components/**/*.js');
var webFileSearch = path.join(__dirname, '../dist/transpiled-web/components/**/*.js');


setCss(componentsFileSearch);
setCss(webFileSearch);
