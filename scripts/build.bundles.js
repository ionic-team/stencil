const fs = require('fs-extra');
const common = require('./build.common');


console.log('build.bundles');

fs.emptyDirSync(common.distPath('ionic-core'));



