const fs = require('fs-extra');
const common = require('./util');


console.log('build.bundles');

fs.emptyDirSync(common.distPath('ionic-core'));



