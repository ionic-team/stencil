import fs from 'fs-extra';
import { join } from 'path';
import { BuildOptions, getOptions } from './utils/options';
import { PackageData } from './utils/write-pkg-json';

const entryDeps = [
  '@rollup/plugin-commonjs',
  '@rollup/plugin-json',
  '@rollup/plugin-node-resolve',
  'ansi-colors',
  'autoprefixer',
  'css',
  'exit',
  'glob',
  'graceful-fs',
  'fast-deep-equal',
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
  'semiver',
  'sizzle',
  'source-map',
  'terser',
  'typescript',
  'ws',
];

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
  'source-map-resolve',
  'urix',
]);

export function createLicense(rootDir: string) {
  const opts = getOptions(rootDir);
  const thirdPartyLicensesRootPath = join(opts.rootDir, 'NOTICE.md');

  const bundledDeps: BundledDep[] = [];

  createBundledDeps(opts, bundledDeps, entryDeps);

  bundledDeps.sort((a, b) => {
    if (a.moduleId < b.moduleId) return -1;
    if (a.moduleId > b.moduleId) return 1;
    return 0;
  });

  const licenses = bundledDeps
    .map((l) => l.license)
    .reduce((arr, l) => {
      if (!arr.includes(l)) {
        arr.push(l);
      }
      return arr;
    }, [])
    .sort();

  const output =
    `
# Licenses of Bundled Dependencies

The published Stencil distribution contains the following licenses:

${licenses.map((l) => `    ` + l).join('\n')}

The following distributions have been modified to be bundled within this distribution:

--------

${bundledDeps.map((l) => l.content).join('\n')}

`.trim() + '\n';

  fs.writeFileSync(thirdPartyLicensesRootPath, output);

  const licenseSource: string[] = [];
  bundledDeps.forEach((d) => {
    licenseSource.push(d.moduleId);
    d.dependencies.forEach((childDep) => {
      licenseSource.push(`  ${childDep}`);
    });
    licenseSource.push('');
  });

  fs.writeFileSync(join(opts.buildDir, 'license-source.txt'), licenseSource.join('\n'));
}

function createBundledDeps(opts: BuildOptions, bundledDeps: BundledDep[], deps: string[]) {
  if (Array.isArray(deps)) {
    deps.forEach((moduleId) => {
      if (includeDepLicense(bundledDeps, moduleId)) {
        const bundledDep = createBundledDepLicense(opts, moduleId);
        bundledDeps.push(bundledDep);

        createBundledDeps(opts, bundledDeps, bundledDep.dependencies);
      }
    });
  }
}

function createBundledDepLicense(opts: BuildOptions, moduleId: string): BundledDep {
  const pkgJsonFile = join(opts.nodeModulesDir, moduleId, 'package.json');
  const pkgJson: PackageData = fs.readJsonSync(pkgJsonFile);
  const output: string[] = [];
  let license: string = null;

  output.push(`## \`${moduleId}\``, ``);

  if (typeof pkgJson.license === 'string') {
    license = pkgJson.license;
    output.push(`License: ${pkgJson.license}`, ``);
  }

  if (Array.isArray(pkgJson.licenses)) {
    const bundledLicenses = [];
    pkgJson.licenses.forEach((l) => {
      if (l.type) {
        license = l.type;
        bundledLicenses.push(l.type);
      }
    });

    if (bundledLicenses.length > 0) {
      output.push(`License: ${bundledLicenses.join(', ')}`, ``);
    }
  }

  const author = getContributors(pkgJson.author);
  if (typeof author === 'string') {
    output.push(`Author: ${author}`, ``);
  }

  const contributors = getContributors(pkgJson.contributors);
  if (typeof contributors === 'string') {
    output.push(`Contributors: ${contributors}`, ``);
  }

  if (typeof pkgJson.homepage === 'string') {
    output.push(`Homepage: ${pkgJson.homepage}`, ``);
  }

  const depLicense = getBundledDepLicenseContent(opts, moduleId);
  if (typeof depLicense === 'string') {
    depLicense
      .trim()
      .split('\n')
      .forEach((ln) => {
        output.push(`> ${ln}`);
      });
  }

  output.push(``, `--------`, ``);

  const dependencies = (pkgJson.dependencies ? Object.keys(pkgJson.dependencies) : []).sort();

  return {
    moduleId,
    content: output.join('\n'),
    license,
    dependencies,
  };
}

interface BundledDep {
  moduleId: string;
  content: string;
  license: string;
  dependencies: string[];
}

function getContributors(prop: any) {
  if (typeof prop === 'string') {
    return prop;
  }

  if (Array.isArray(prop)) {
    return prop
      .map(getAuthor)
      .filter((c) => !!c)
      .join(', ');
  }

  if (prop) {
    return getAuthor(prop);
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
  const licenseFiles = ['LICENSE', 'LICENSE.md', 'LICENSE-MIT', 'LICENSE.txt'];
  for (const licenseFile of licenseFiles) {
    try {
      const licensePath = join(opts.nodeModulesDir, moduleId, licenseFile);
      return fs.readFileSync(licensePath, 'utf8');
    } catch (e) {}
  }
}

function includeDepLicense(bundledDeps: BundledDep[], moduleId: string) {
  if (manuallyNotBundled.has(moduleId)) {
    return false;
  }
  if (moduleId.startsWith('@types/')) {
    return false;
  }
  if (bundledDeps.some((b) => b.moduleId === moduleId)) {
    return false;
  }
  return true;
}
