const fs = require('fs-extra');
const path = require('path');

const bundledDeps = [
  'ansi-colors',
  'autoprefixer',
  'cssnano',
  'css-what',
  'exit',
  'glob',
  'graceful-fs',
  'is-glob',
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
  'terser',
  'ws',
].sort();


const thirdPartyLicensesRootPath = path.join(__dirname, '..', 'NOTICE.md');
const allLicenses = [];
const depLicenses = bundledDeps.map(createBundledDepLicense);

const output = `
# Licenses of Bundled Dependencies

The published Stencil distribution contains the following licenses:

${allLicenses.sort().map(l => `    ` + l).join('\n')}


-----------------------------------------

${depLicenses.join('\n')}

`.trimLeft();

fs.writeFileSync(thirdPartyLicensesRootPath, output);


function createBundledDepLicense(moduleId) {
  const pkgJsonFile = path.join(__dirname, '..', 'node_modules', moduleId, 'package.json');
  const pkgJson = fs.readJsonSync(pkgJsonFile);
  const output = [];

  output.push(
    `## \`${moduleId}\``,
    ``,
  );

  if (typeof pkgJson.license === 'string') {
    if (!allLicenses.includes(pkgJson.license)) {
      allLicenses.push(pkgJson.license);
    }
    output.push(
      `License: ${pkgJson.license}`, ``
    );
  }

  if (Array.isArray(pkgJson.licenses)) {
    const bundledLicenses = [];
    pkgJson.licenses.forEach(l => {
      if (l.type) {
        if (!allLicenses.includes(l.type)) {
          allLicenses.push(l.type);
        }
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

  if (pkgJson.repository && pkgJson.repository.url) {
    output.push(
      `Repository: ${pkgJson.repository.url}`, ``
    );
  }

  const depLicense = getBundledDepLicenseContent(moduleId, pkgJson);
  if (typeof depLicense === 'string') {
    depLicense.trim().split('\n').forEach(ln => {
      output.push(`> ${ln}`);
    });
  }

  output.push(``, `-----------------------------------------`, ``);

  return output.join('\n');
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

function getBundledDepLicenseContent(moduleId) {
  const nodeModulesDir = path.join(__dirname, '..', 'node_modules');

  try {
    const licensePath = path.join(nodeModulesDir, moduleId, 'LICENSE');
    return fs.readFileSync(licensePath, 'utf8');

  } catch (e) {

    try {
      const licensePath = path.join(nodeModulesDir, moduleId, 'LICENSE.md');
      return fs.readFileSync(licensePath, 'utf8');

    } catch (e) {
      try {
        const licensePath = path.join(nodeModulesDir, moduleId, 'LICENSE-MIT');
        return fs.readFileSync(licensePath, 'utf8');
      } catch (e) {}
    }
  }
}

console.log(`📝  Build License`);
