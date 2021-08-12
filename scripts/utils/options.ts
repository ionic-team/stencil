import { join } from 'path';
import { getVermoji } from './vermoji';
import { PackageData } from './write-pkg-json';
import { readFileSync } from 'fs-extra';

export function getOptions(rootDir: string, inputOpts: BuildOptions = {}) {
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
      sysDenoDir: join(rootDir, 'sys', 'deno'),
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
    opts.version = '0.0.0-dev.' + opts.buildId;
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

export function createReplaceData(opts: BuildOptions) {
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
    sysDenoDir: string;
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
}

export interface CmdLineArgs {
  'config-version'?: string;
  'config-build-id'?: string;
  'config-prod'?: string;
}

function getBuildId() {
  const d = new Date();
  return [
    d.getUTCFullYear() + '',
    ('0' + (d.getUTCMonth() + 1)).slice(-2),
    ('0' + d.getUTCDate()).slice(-2),
    ('0' + d.getUTCHours()).slice(-2),
    ('0' + d.getUTCMinutes()).slice(-2),
    ('0' + d.getUTCSeconds()).slice(-2),
  ].join('');
}
