import { execSync } from 'child_process';
import { readFileSync } from 'fs-extra';
import { join } from 'path';

import { getVermoji } from './vermoji';
import { PackageData } from './write-pkg-json';

/**
 * Retrieves information used during a 'process' that requires knowledge of various project file paths, Stencil version
 * information, and GitHub repo metadata. A 'process' may include, but is not limited to:
 * - generating a new release
 * - regenerating a license file
 * - validating a build
 * @param rootDir the root directory of the project
 * @param inputOpts any build options to override manually
 * @returns an entity containing various fields to be used by some process
 */
export function getOptions(rootDir: string, inputOpts: BuildOptions = {}): BuildOptions {
  const srcDir = join(rootDir, 'src');
  const packageJsonPath = join(rootDir, 'package.json');
  const packageLockJsonPath = join(rootDir, 'package-lock.json');
  const changelogPath = join(rootDir, 'CHANGELOG.md');
  const nodeModulesDir = join(rootDir, 'node_modules');
  const typescriptDir = join(nodeModulesDir, 'typescript');
  const typescriptLibDir = join(typescriptDir, 'lib');
  const buildDir = join(rootDir, 'build');
  const scriptsDir = join(rootDir, 'scripts');
  const scriptsBuildDir = join(scriptsDir, 'build');
  const scriptsBundlesDir = join(scriptsDir, 'bundles');
  const bundleHelpersDir = join(scriptsBundlesDir, 'helpers');

  const opts: BuildOptions = {
    ghRepoOrg: 'ionic-team',
    ghRepoName: 'stencil',
    rootDir,
    srcDir,
    packageJsonPath,
    packageLockJsonPath,
    changelogPath,
    nodeModulesDir,
    typescriptDir,
    typescriptLibDir,
    buildDir,
    scriptsDir,
    scriptsBuildDir,
    scriptsBundlesDir,
    bundleHelpersDir,
    output: {
      cliDir: join(rootDir, 'cli'),
      compilerDir: join(rootDir, 'compiler'),
      devServerDir: join(rootDir, 'dev-server'),
      internalDir: join(rootDir, 'internal'),
      mockDocDir: join(rootDir, 'mock-doc'),
      screenshotDir: join(rootDir, 'screenshot'),
      sysNodeDir: join(rootDir, 'sys', 'node'),
      testingDir: join(rootDir, 'testing'),
    },
    packageJson: JSON.parse(readFileSync(packageJsonPath, 'utf8')),
    version: null,
    buildId: null,
    isProd: false,
    isCI: false,
    isPublishRelease: false,
    vermoji: null,
    tag: 'dev',
  };

  Object.assign(opts, inputOpts);

  if (!opts.buildId) {
    opts.buildId = getBuildId();
  }

  if (!opts.version) {
    opts.version = getDevVersionId({ buildId: opts.buildId, semverVersion: opts.packageJson?.version });
  }

  if (opts.isPublishRelease) {
    if (!opts.isProd) {
      throw new Error('release must also be a prod build');
    }
  }

  if (!opts.vermoji) {
    if (opts.isProd) {
      opts.vermoji = getVermoji(opts.changelogPath);
    } else {
      opts.vermoji = '💎';
    }
  }

  return opts;
}

/**
 * Generates an object containing versioning information of various packages installed at build time
 * @param opts the options being used during a build
 * @returns an object that contains package names/versions installed at the time a build was invoked
 */
export function createReplaceData(opts: BuildOptions): Record<string, any> {
  const CACHE_BUSTER = 7;

  const typescriptPkg = require(join(opts.typescriptDir, 'package.json'));
  opts.typescriptVersion = typescriptPkg.version;
  const transpileId = typescriptPkg.name + typescriptPkg.version + '_' + CACHE_BUSTER;

  const terserPkg = getPkg(opts, 'terser');
  opts.terserVersion = terserPkg.version;
  const minifyJsId = terserPkg.name + terserPkg.version + '_' + CACHE_BUSTER;

  const rollupPkg = getPkg(opts, 'rollup');
  opts.rollupVersion = rollupPkg.version;
  const bundlerId = rollupPkg.name + rollupPkg.version + '_' + CACHE_BUSTER;

  const autoprefixerPkg = getPkg(opts, 'autoprefixer');
  const postcssPkg = getPkg(opts, 'postcss');

  const optimizeCssId =
    autoprefixerPkg.name + autoprefixerPkg.version + '_' + postcssPkg.name + postcssPkg.version + '_' + CACHE_BUSTER;

  const parse5Pkg = getPkg(opts, 'parse5');
  opts.parse5Verion = parse5Pkg.version;

  const sizzlePkg = getPkg(opts, 'sizzle');
  opts.sizzleVersion = sizzlePkg.version;

  return {
    __BUILDID__: opts.buildId,
    '__BUILDID:BUNDLER__': bundlerId,
    '__BUILDID:MINIFYJS__': minifyJsId,
    '__BUILDID:OPTIMIZECSS__': optimizeCssId,
    '__BUILDID:TRANSPILE__': transpileId,

    '__VERSION:STENCIL__': opts.version,
    '__VERSION:PARSE5__': parse5Pkg.version,
    '__VERSION:ROLLUP__': rollupPkg.version,
    '__VERSION:SIZZLE__': rollupPkg.version,
    '__VERSION:TERSER__': terserPkg.version,
    '__VERSION:TYPESCRIPT__': typescriptPkg.version,

    __VERMOJI__: opts.vermoji,
  };
}

/**
 * Retrieves a package from the `node_modules` directory in the given `opts` parameter
 * @param opts the options being used during a build
 * @param pkgName the name of the NPM package to retrieve
 * @returns information about the retrieved package
 */
function getPkg(opts: BuildOptions, pkgName: string): PackageData {
  return require(join(opts.nodeModulesDir, pkgName, 'package.json'));
}

export interface BuildOptions {
  ghRepoOrg?: string;
  ghRepoName?: string;
  rootDir?: string;
  srcDir?: string;
  nodeModulesDir?: string;
  typescriptDir?: string;
  typescriptLibDir?: string;
  buildDir?: string;
  scriptsDir?: string;
  scriptsBundlesDir?: string;
  scriptsBuildDir?: string;
  bundleHelpersDir?: string;

  output?: {
    cliDir: string;
    compilerDir: string;
    devServerDir: string;
    internalDir: string;
    mockDocDir: string;
    screenshotDir: string;
    sysNodeDir: string;
    testingDir: string;
  };

  version?: string;
  buildId?: string;
  isProd?: boolean;
  isPublishRelease?: boolean;
  isCI?: boolean;
  vermoji?: string;
  packageJsonPath?: string;
  packageLockJsonPath?: string;
  packageJson?: PackageData;
  changelogPath?: string;
  tag?: string;
  typescriptVersion?: string;
  rollupVersion?: string;
  parse5Verion?: string;
  sizzleVersion?: string;
  terserVersion?: string;
  otp?: string;
}

/**
 * Generate a build identifier, which is the Epoch Time in seconds
 * @returns the generated build ID
 */
function getBuildId(): string {
  return Date.now().toString(10).slice(0, -3);
}

/**
 * Describes the contents of a version string for Stencil used in 'non-production' builds (e.g. a one-off dev build)
 */
interface DevVersionContents {
  /**
   * The build identifier string, used to uniquely identify when the build was generated
   */
  buildId: string;
  /**
   * A semver-compliant string to add to the one-off build version sting, used to identify a base version of Stencil
   * that was used in the build.
   */
  semverVersion: string | undefined;
}

/**
 * Helper function to return the first seven characters of a git SHA
 *
 * We use the first seven characters for two reasons:
 * 1. Seven characters _should_ be enough to uniquely ID a commit in Stencil
 * 2. It matches the number of characters used in our CHANGELOG.md
 *
 * @returns the seven character SHA
 */
function getSevenCharGitSha(): string {
  return execSync('git rev-parse HEAD').toString().trim().slice(0, 7);
}

/**
 * Helper function to generate a dev build version string of the format:
 *
 * [BASE_VERSION]-dev.[BUILD_IDENTIFIER].[GIT_SHA]
 *
 * where:
 * - BASE_VERSION is the version of Stencil currently assigned in `package.json`
 * - BUILD_IDENTIFIER is a unique identifier for this particular build
 * - GIT_SHA is the SHA of the HEAD of the branch this build was created from
 *
 * @param devVersionContents an object containing the necessary arguments to build a dev-version identifier
 * @returns the generated version string
 */
function getDevVersionId(devVersionContents: DevVersionContents): string {
  const { buildId, semverVersion } = devVersionContents;
  // if `package.json#package` is empty, default to a value that doesn't imply any particular version of Stencil
  const version = semverVersion ?? '0.0.0';
  // '-' and '-dev.' are a magic substrings that may get checked on startup of a Stencil process.
  return version + '-dev.' + buildId + '.' + getSevenCharGitSha();
}
