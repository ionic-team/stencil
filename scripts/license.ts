import fs from 'fs-extra';
import { join } from 'path';
import { BuildOptions, getOptions } from './utils/options';
import { PackageData } from './utils/write-pkg-json';

/**
 * Dependencies that will be included in the Stencil output
 */
const entryDeps = [
  '@rollup/plugin-commonjs',
  '@rollup/plugin-json',
  '@rollup/plugin-node-resolve',
  '@yarnpkg/lockfile',
  'ansi-colors',
  'autoprefixer',
  'css',
  'exit',
  'glob',
  'graceful-fs',
  'fast-deep-equal',
  'is-extglob',
  'merge-source-map',
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

/**
 * Generate LICENSE.md for Stencil
 * @param rootDir the root directory of the Stencil repo
 */
export function createLicense(rootDir: string): void {
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

/**
 * Generate license metadata for a series of dependencies
 * @param opts metadata used during the generation of a license
 * @param bundledDeps the current list of dependencies to bundle
 * @param deps the dependencies to generate metadata for
 */
function createBundledDeps(opts: BuildOptions, bundledDeps: BundledDep[], deps: ReadonlyArray<string>): void {
  deps.forEach((moduleId) => {
    if (includeDepLicense(bundledDeps, moduleId)) {
      const bundledDep = createBundledDepLicense(opts, moduleId);
      bundledDeps.push(bundledDep);

      // evaluate the dependencies of the dependency for inclusion
      createBundledDeps(opts, bundledDeps, bundledDep.dependencies);
    }
  });
}

/**
 * Generate license metadata for a single dependency
 * @param opts build options to be used to determine where to inspect dependencies
 * @param moduleId the name of the dependency to generate a license for
 * @returns all metadata for a dependency that was able to be retrieved for the given dependency
 */
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

/**
 * Representation of a dependency that is bundled with Stencil which has a license to be written to disk
 */
interface BundledDep {
  moduleId: string;
  content: string;
  license: string;
  dependencies: string[];
}

/**
 * Format the list of contributors for a dependency
 * @param contributors the contributors, as read from a `package.json` file
 * @returns the contributors list, formatted
 */
function getContributors(contributors: unknown): typeof contributors {
  if (typeof contributors === 'string') {
    return contributors;
  }

  if (Array.isArray(contributors)) {
    return contributors
      .map(getAuthor)
      .filter((c) => !!c)
      .join(', ');
  }

  if (contributors) {
    return getAuthor(contributors);
  }
}

/**
 * Formats an individual contributor's information
 * @param contributor the contributor information
 * @returns the formatted contributor information
 */
function getAuthor(contributor: any): string {
  if (typeof contributor === 'string') {
    return contributor;
  }
  if (typeof contributor.name === 'string') {
    if (typeof contributor.url === 'string') {
      return `[${contributor.name}](${contributor.url})`;
    } else {
      return contributor.name;
    }
  }
  if (typeof contributor.url === 'string') {
    return contributor.url;
  }
}

/**
 * Retrieve the license file for a dependency. This function assumes that the license will be provided in an external
 * file by the dependency. It is therefore possible that the addition/removal of a license file in a dependency will
 * alter Stencil's generated LICENSE.md file between releases.
 * @param opts build options to be used to determine where to look for a license
 * @param moduleId the name of the dependency to check
 * @returns the license for a dependency, undefined if none was found
 */
function getBundledDepLicenseContent(opts: BuildOptions, moduleId: string): string | undefined {
  const licenseFiles = ['LICENSE', 'LICENSE.md', 'LICENSE-MIT', 'LICENSE.txt'];
  for (const licenseFile of licenseFiles) {
    try {
      const licensePath = join(opts.nodeModulesDir, moduleId, licenseFile);
      return fs.readFileSync(licensePath, 'utf8');
    } catch (e) {}
  }
}

/**
 * Determines if a dependency's license should be included in the generated license file or not
 * @param bundledDeps the current list of dependencies to bundle
 * @param moduleId the name of the dependency to check for inclusion
 * @returns true of the dependency's license should be included, false otherwise
 */
function includeDepLicense(bundledDeps: BundledDep[], moduleId: string): boolean {
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
