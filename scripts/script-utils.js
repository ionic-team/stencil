const path = require('path');
const cp = require('child_process');

function relativeResolve(importer, TRANSPILED_DIR, relativePath) {
  const absolutePath = path.resolve(TRANSPILED_DIR, relativePath);
  return {
    id: path.posix.relative(path.posix.dirname(importer), absolutePath),
    external: true
  };
}
exports.relativeResolve = relativeResolve;


function transpile(tsConfigPath) {
  try {
    tsConfigPath = path.resolve(__dirname, tsConfigPath);

    const tscPath = path.join(__dirname, '..', 'node_modules', '.bin', 'tsc');

    const cmd = `"${tscPath}" -p "${tsConfigPath}"`;
    cp.execSync(cmd, { cwd: path.join(__dirname, '..') }).toString();

  } catch (e) {
    throw new Error(e.stdout.toString());
  }
}
exports.transpile = transpile;


async function run(cb) {
  try {
    await cb();

  } catch (e) {
    if (e && e.message) {
      const msg = e.message.toString().trim();
      if (msg.length > 0) {
        console.error(msg);
      }
    }
    process.exit(1);
  }
}
exports.run = run;


function getBuildId() {
  const d = new Date();

  let buildId = d.getUTCFullYear();
  buildId += ('0' + (d.getUTCMonth() + 1)).slice(-2);
  buildId += ('0' + d.getUTCDate()).slice(-2);
  buildId += ('0' + d.getUTCHours()).slice(-2);
  buildId += ('0' + d.getUTCMinutes()).slice(-2);
  buildId += ('0' + d.getUTCSeconds()).slice(-2);

  return buildId;
}
exports.getBuildId = getBuildId;


function updateBuildIds(input) {
  let buildId = (process.argv.find(a => a.startsWith('--build-id=')) || '').replace('--build-id=', '');
  if (buildId === '') {
    buildId = getBuildId();
  }

  let output = input;

  // increment this number to bust the cache entirely
  const CACHE_BUSTER = 2;

  output = output.replace(/__BUILDID__/g, buildId);

  const transpilePkg = require('../node_modules/typescript/package.json');
  const transpileId = transpilePkg.name + transpilePkg.version + '_' + CACHE_BUSTER;
  output = output.replace(/__BUILDID:TRANSPILE__/g, transpileId);

  const minifyJsPkg = require('../node_modules/terser/package.json');
  const minifyJsId = minifyJsPkg.name + minifyJsPkg.version + '_' + CACHE_BUSTER;
  output = output.replace(/__BUILDID:MINIFYJS__/g, minifyJsId);

  const autoprefixerPkg = require('../node_modules/autoprefixer/package.json');
  const cssnanoPkg = require('../node_modules/cssnano/package.json');
  const postcssPkg = require('../node_modules/postcss/package.json');
  const id = autoprefixerPkg.name + autoprefixerPkg.version + '_' + cssnanoPkg.name + cssnanoPkg.version + '_' + postcssPkg.name + postcssPkg.version + '_' + CACHE_BUSTER;
  output = output.replace(/__BUILDID:OPTIMIZECSS__/g, id);

  return output;
}
exports.updateBuildIds = updateBuildIds;


process.on(`unhandledRejection`, (e) => {
  if (e) {
    console.error(e.toString());
  }
  process.exit(1);
});
