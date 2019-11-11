const fs = require('fs-extra');
const path = require('path');

const entryDeps = [
  'ansi-colors',
  'autoprefixer',
  'cssnano',
  'css-what',
  'exit',
  'glob',
  'graceful-fs',
  'is-glob',
  'is-extglob',
  'minimatch',
  'node-fetch',
  'open',
  'parse5',
  'pixelmatch',
  'pngjs',
  'postcss',
  'prompts',
  'rollup',
  'rollup-plugin-commonjs',
  'rollup-plugin-node-resolve',
  'semver',
  'source-map',
  'terser',
  'ws',
];


function createLicense(opts) {
  const thirdPartyLicensesRootPath = path.join(opts.rootDir, 'NOTICE.md');

  const bundledDeps = [];

  createBundledDeps(opts, bundledDeps, entryDeps);

  bundledDeps.sort((a, b) => {
    if (a.moduleId < b.moduleId) return -1;
    if (a.moduleId > b.moduleId) return 1;
    return 0;
  });

  const licenses = bundledDeps
    .map(l => l.license)
    .reduce((arr, l) => {
      if (!arr.includes(l)) {
        arr.push(l)
      }
      return arr;
    }, [])
    .sort();

  const output = `
# Licenses of Bundled Dependencies

The published Stencil distribution contains the following licenses:

${licenses.map(l => `    ` + l).join('\n')}


-----------------------------------------

${bundledDeps.map(l => l.content).join('\n')}

`.trim() + '\n';

  fs.writeFileSync(thirdPartyLicensesRootPath, output);
}

function createBundledDeps(opts, bundledDeps, deps) {
  if (Array.isArray(deps)) {
    deps.forEach(moduleId => {
      if (includeDepLicense(bundledDeps, moduleId)) {
        const bundledDep = createBundledDepLicense(opts, moduleId);
        bundledDeps.push(bundledDep);

        createBundledDeps(opts, bundledDeps, bundledDep.dependencies);
      }
    });
  }
}

function createBundledDepLicense(opts, moduleId) {
  const pkgJsonFile = path.join(opts.nodeModulesDir, moduleId, 'package.json');
  const pkgJson = fs.readJsonSync(pkgJsonFile);
  const output = [];
  let license = null;

  output.push(
    `## \`${moduleId}\``,
    ``,
  );

  if (typeof pkgJson.license === 'string') {
    license = pkgJson.license;
    output.push(
      `License: ${pkgJson.license}`, ``
    );
  }

  if (Array.isArray(pkgJson.licenses)) {
    const bundledLicenses = [];
    pkgJson.licenses.forEach(l => {
      if (l.type) {
        license = l.type;
        bundledLicenses.push(l.type);
      }
    });

    if (bundledLicenses.length > 0) {
      output.push(
        `License: ${bundledLicenses.join(', ')}`, ``
      );
    }
  }

  const author = getContributors(pkgJson.author);
  if (typeof author === 'string') {
    output.push(
      `Author: ${author}`, ``
    );
  }

  const contributors = getContributors(pkgJson.contributors);
  if (typeof contributors === 'string') {
    output.push(
      `Contributors: ${contributors}`, ``
    );
  }

  if (typeof pkgJson.homepage === 'string') {
    output.push(
      `Homepage: ${pkgJson.homepage}`, ``
    );
  }

  const depLicense = getBundledDepLicenseContent(opts, moduleId);
  if (typeof depLicense === 'string') {
    depLicense.trim().split('\n').forEach(ln => {
      output.push(`> ${ln}`);
    });
  }

  output.push(``, `-----------------------------------------`, ``);

  const dependencies = (pkgJson.dependencies ? Object.keys(pkgJson.dependencies) : []).sort();

  return {
    moduleId,
    content: output.join('\n'),
    license,
    dependencies,
  };
}

function getContributors(prop) {
  if (typeof prop === 'string') {
    return prop;
  }

  if (Array.isArray(prop)) {
    return prop.map(getAuthor)
      .filter(c => !!c).join(', ');
  }

  if (prop) {
    return getAuthor(prop)
  }
}

function getAuthor(c) {
  if (typeof c === 'string') {
    return c;
  }
  if (typeof c.name === 'string') {
    if (typeof c.url === 'string') {
      return `[${c.name}](${c.url})`;
    } else {
      return c.name;
    }
  }
  if (typeof c.url === 'string') {
    return c.url;
  }
}

function getBundledDepLicenseContent(opts, moduleId) {
  try {
    const licensePath = path.join(opts.nodeModulesDir, moduleId, 'LICENSE');
    return fs.readFileSync(licensePath, 'utf8');
  } catch (e) {

    try {
      const licensePath = path.join(opts.nodeModulesDir, moduleId, 'LICENSE.md');
      return fs.readFileSync(licensePath, 'utf8');

    } catch (e) {
      try {
        const licensePath = path.join(opts.nodeModulesDir, moduleId, 'LICENSE-MIT');
        return fs.readFileSync(licensePath, 'utf8');
      } catch (e) {}
    }
  }
}

function includeDepLicense(bundledDeps, moduleId) {
  if (manuallyNotBundled.has(moduleId)) {
    return false;
  }
  if (moduleId.startsWith('@types/')) {
    return false;
  }
  if (bundledDeps.some(b => b.moduleId === moduleId)) {
    return false;
  }
  return true;
}

// bundle does not include these
// scripts/bundles/helpers/cssnano-preset-default.js
const manuallyNotBundled = new Set([
  'chalk',
  'commander',
  'cosmiconfig',
  'css-declaration-sorter',
  'minimist',
  'postcss-calc',
  'postcss-discard-overridden',
  'postcss-merge-longhand',
  'postcss-normalize-charset',
  'postcss-normalize-timing-functions',
  'postcss-normalize-unicode',
  'postcss-svgo',
]);

createLicense({
  rootDir: path.join(__dirname, '..'),
  nodeModulesDir: path.join(__dirname, '..', 'node_modules'),
});
