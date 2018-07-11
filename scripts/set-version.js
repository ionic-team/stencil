const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');


function getVersion() {
  return process.argv[process.argv.length - 1];
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
packageJson.version = getVersion();

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
