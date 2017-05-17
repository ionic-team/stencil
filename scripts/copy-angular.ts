import { BUNDLES } from './angular-bundles';
import * as fs from 'fs-extra';
import * as path from 'path';

const srcDir = path.join(__dirname, '../..');
const srcComponents = path.join(srcDir, 'src/components');
const srcThemes = path.join(srcDir, 'src/themes');
const srcUtil = path.join(srcDir, 'src/util');

const destDir = path.join(__dirname, '../../../ionic');
const destComponents = path.join(destDir, 'src/components');
const destThemes = path.join(destDir, 'src/themes');
const destUtil = path.join(destDir, 'src/util');

console.log(`copy to ionic-angular, from`, srcDir, `to`, destDir);

fs.readdirSync(srcComponents).forEach(fileName => {
  var srcFile = path.join(srcComponents, fileName);
  if (fs.lstatSync(srcFile).isFile() && fileName.indexOf('.') !== 0) {
    fs.copySync(srcFile, path.join(destComponents, fileName))
  }
});

fs.copySync('src/vendor', path.join(destDir, 'src/vendor'));


BUNDLES.forEach(b => {
  b.components.forEach(tag => {
    const folderName = tag.replace('ion-', '');
    const srcDir = path.join(srcComponents, folderName);
    const destDir = path.join(destComponents, folderName);
    try {
      const componentFiles = fs.readdirSync(srcDir);
      if (componentFiles.length) {
        fs.ensureDirSync(destDir);

        componentFiles.forEach(fileName => {
          const srcFile = path.join(srcDir, fileName);
          const destFile = path.join(destDir, fileName);

          if (fileName.indexOf('.') === 0) return;

          fs.copySync(srcFile, destFile);
        });
      }
    } catch (e) {

    }
  });
});


fs.readdirSync(srcThemes).forEach(fileName => {
  const srcFile = path.join(srcThemes, fileName);
  const destFile = path.join(destThemes, fileName);

  if (fileName.indexOf('.') === 0) return;

  fs.copySync(srcFile, destFile);
});


[
  'helpers.ts',
  'interfaces.ts',
].forEach(fileName => {
  const srcFile = path.join(srcUtil, fileName);
  const destFile = path.join(destUtil, fileName);

  if (fileName.indexOf('.') === 0) return;

  fs.copySync(srcFile, destFile);
});
