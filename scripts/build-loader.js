const fs = require('fs-extra');
const path = require('path');


const ROOT_DIR = path.join(__dirname, '../');
const DST_DIR = path.join(ROOT_DIR, 'dist');
const TRANSPILED_DIR = path.join(DST_DIR, 'transpiled-core');
const DIST_CLIENT_DIR = path.join(DST_DIR, 'client');


// empty out the dist/client directory
fs.ensureDirSync(DIST_CLIENT_DIR);


// tasks
const srcLoaderPath = path.join(TRANSPILED_DIR, 'client/loader.js');
const dstLoaderPath = path.join(DST_DIR, 'client/loader.js');

let content = fs.readFileSync(srcLoaderPath, 'utf-8');

content = content.replace(/export function /g, 'function ');

content = `(function(win, doc, appNamespace, publicPath, appCore, appCoreSsr, appCorePolyfilled, hydratedCssClass, components) {

${content}

init(win, doc, appNamespace, publicPath, appCore, appCoreSsr, appCorePolyfilled, hydratedCssClass, components);

})(window, document, '__APP__');`;

fs.writeFileSync(dstLoaderPath, content);
