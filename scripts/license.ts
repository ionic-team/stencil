import fs from 'fs-extra';
import { join } from 'path';
import { BuildOptions, getOptions } from './utils/options';
import { PackageData } from './utils/write-pkg-json';


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


export function createLicense(rootDir: string) {
  const opts = getOptions(rootDir);
  const licenseCorePath = join(opts.scriptsDir, 'LICENSE.md');
  const licenseRootPath = join(opts.rootDir, 'LICENSE.md');

  const depLicenses = bundledDeps.map(moduleId => {
    return createBundledDepLicense(opts, moduleId);
  });

  const licenses = depLicenses
    .map(l => l.license)
    .reduce((arr, l) => {
      if (!arr.includes(l)) {
        arr.push(l)
      }
      return arr;
    }, [])
    .sort();

  const output = `

# Stencil Core License

${fs.readFileSync(licenseCorePath, 'utf8').trim()}


## Licenses of Bundled Dependencies

The published Stencil distribution contains the following licenses:

${licenses.map(l => `    ` + l).join('\n')}


-----------------------------------------

${depLicenses.map(l => l.content).join('\n')}

`.trimLeft();

  fs.writeFileSync(licenseRootPath, output);
}


function createBundledDepLicense(opts: BuildOptions, moduleId: string) {
  const pkgJsonFile = join(opts.nodeModulesDir, moduleId, 'package.json');
  const pkgJson: PackageData = fs.readJsonSync(pkgJsonFile);
  const output: string[] = [];
  let license: string = null;

  output.push(
    `### \`${moduleId}\``,
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

  return {
    content: output.join('\n'),
    license
  };
}

function getContributors(prop: any) {
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

function getAuthor(c: any) {
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

function getBundledDepLicenseContent(opts: BuildOptions, moduleId: string) {
  try {
    const licensePath = join(opts.nodeModulesDir, moduleId, 'LICENSE');
    return fs.readFileSync(licensePath, 'utf8');
  } catch (e) {

    try {
      const licensePath = join(opts.nodeModulesDir, moduleId, 'LICENSE.md');
      return fs.readFileSync(licensePath, 'utf8');

    } catch (e) {
      try {
        const licensePath = join(opts.nodeModulesDir, moduleId, 'LICENSE-MIT');
        return fs.readFileSync(licensePath, 'utf8');
      } catch (e) {}
    }
  }
}
