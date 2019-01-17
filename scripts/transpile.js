const path = require('path');
const cp = require('child_process');


module.exports = function transpile(tsConfigPath) {
  try {
    tsConfigPath = path.resolve(__dirname, tsConfigPath);

    const tscPath = path.join(__dirname, '..', 'node_modules', '.bin', 'tsc');

    const cmd = `${tscPath} -p ${tsConfigPath}`;
    cp.execSync(cmd, { cwd: path.join(__dirname, '..') }).toString();

  } catch (e) {
    throw new Error(e.stdout.toString());
  }
}
