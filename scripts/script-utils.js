const fs = require('fs-extra');
const path = require('path');
const cp = require('child_process');

function relativeResolve(relativePath) {
  return {
    id: relativePath,
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


function updateBuildIds(code) {
  let buildId = (process.argv.find(a => a.startsWith('--build-id=')) || '').replace('--build-id=', '');
  if (buildId === '') {
    buildId = getBuildId();
  }

  // increment this number to bust the cache entirely
  const CACHE_BUSTER = 3;

  code = code.replace(/__BUILDID__/g, buildId);

  const typescriptPkg = require('../node_modules/typescript/package.json');
  const transpileId = typescriptPkg.name + typescriptPkg.version + '_' + CACHE_BUSTER;
  code = code.replace(/__BUILDID:TRANSPILE__/g, transpileId);
  code = code.replace(/__VERSION:TYPESCRIPT__/g, typescriptPkg.version);

  const terserPkg = require('../node_modules/terser/package.json');
  const minifyJsId = terserPkg.name + terserPkg.version + '_' + CACHE_BUSTER;
  code = code.replace(/__BUILDID:MINIFYJS__/g, minifyJsId);
  code = code.replace(/__VERSION:TERSER__/g, terserPkg.version);

  const rollupPkg = require('../node_modules/rollup/package.json');
  const bundlerId = rollupPkg.name + rollupPkg.version + '_' + CACHE_BUSTER;
  code = code.replace(/__BUILDID:BUNDLER__/g, bundlerId);
  code = code.replace(/__VERSION:ROLLUP__/g, rollupPkg.version);

  const autoprefixerPkg = require('../node_modules/autoprefixer/package.json');
  const cssnanoPkg = require('../node_modules/cssnano/package.json');
  const postcssPkg = require('../node_modules/postcss/package.json');
  const id = autoprefixerPkg.name + autoprefixerPkg.version + '_' + cssnanoPkg.name + cssnanoPkg.version + '_' + postcssPkg.name + postcssPkg.version + '_' + CACHE_BUSTER;
  code = code.replace(/__BUILDID:OPTIMIZECSS__/g, id);

  return code;
}
exports.updateBuildIds = updateBuildIds;


async function updateReleaseVersion(releaseVersion) {
  const root = path.join(__dirname, '..');
  const dirs = [
    'dist',
    'compiler',
    'build-conditionals',
    'internal',
    'mock-doc',
    'screenshot',
    'runtime',
    'sys',
    'testing'
  ].map(subModuleDir => {
    return path.join(root, subModuleDir);
  });

  await Promise.all(dirs.map(async dir => {
    await updateDirReleaseVersion(releaseVersion, dir);
  }));
}
exports.updateReleaseVersion = updateReleaseVersion;

async function updateDirReleaseVersion(releaseVersion, dir) {
  const items = await fs.readdir(dir);
  await Promise.all(items.map(async item => {
    const p = path.join(dir, item);
    const stat = await fs.stat(p);
    if (stat.isFile() && p.endsWith('js')) {
      let code = await fs.readFile(p, 'utf-8');
      if (code.includes('0.0.0-stencil-dev')) {
        code = code.replace(/0.0.0-stencil-dev/g, releaseVersion);
        await fs.writeFile(p, code);
      }

    } else if (stat.isDirectory()) {
      await updateDirReleaseVersion(releaseVersion, p);
    }
  }));
}


process.on(`unhandledRejection`, (e) => {
  if (e) {
    console.error(e.toString());
  }
  process.exit(1);
});
