const fs = require('fs-extra');
const path = require('path');


const cleanDirs = [
  'dist'
];

cleanDirs.forEach(dir => {
  fs.removeSync(path.join(__dirname, '../', dir));
});
