// just a hack so we can create an index.html
// that doesn't run the script so we can test
// prerendering is kicking in correctly

const fs = require('fs');
const path = require('path');
const { WWW_OUT_DIR } = require('../constants');

const wwwWithScriptPath = path.join(__dirname, '..', WWW_OUT_DIR, 'prerender', 'index.html');
const wwwNoScriptPath = path.join(__dirname, '..', WWW_OUT_DIR, 'prerender', 'index-no-script.html');

const wwwWithScript = fs.readFileSync(wwwWithScriptPath, 'utf8');

const wwwNoScript = wwwWithScript.replace(/<script/gi, '<script type="disable/script"');

fs.writeFileSync(wwwNoScriptPath, wwwNoScript);
