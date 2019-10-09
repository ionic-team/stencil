import { join } from 'path';
import { getVermoji } from './vermoji';


export function getOptions(rootDir: string, inputOpts: BuildOptions) {
  const srcDir = join(rootDir, 'src');
  const packageJsonPath = join(rootDir, 'package.json');
  const changelogPath = join(rootDir, 'CHANGELOG.md');
  const nodeModulesDir = join(rootDir, 'node_modules');
  const transpiledDir = join(rootDir, 'build');
  const scriptsDir = join(rootDir, 'scripts');
  const scriptsBundlesDir = join(scriptsDir, 'bundles');
  const bundleHelpersDir = join(scriptsBundlesDir, 'helpers');

  const opts: BuildOptions = {
    rootDir,
    srcDir,
    packageJsonPath,
    changelogPath,
    nodeModulesDir,
    transpiledDir,
    scriptsDir,
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
    replaceData: null,
    version: null,
    buildId: null,
    isProd: false,
    isCI: false,
    isPublishRelease: false,
    vermoji: null,
    tag: 'dev'
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
      opts.vermoji = getVermoji(opts.changelogPath)
    } else {
      opts.vermoji = '💎';
    }
  }

  opts.replaceData = createReplaceData(opts);

  if (inputOpts.replaceData) {
    Object.assign(opts.replaceData, inputOpts.replaceData);
  }

  return opts;
}


function createReplaceData(opts: BuildOptions) {
  const CACHE_BUSTER = 4;

  const typescriptPkg = require(join(opts.nodeModulesDir, 'typescript', 'package.json'));
  opts.typescriptVersion = typescriptPkg.version;
  const transpileId = typescriptPkg.name + typescriptPkg.version + '_' + CACHE_BUSTER;

  const terserPkg = require(join(opts.nodeModulesDir, 'terser', 'package.json'));
  opts.terserVersion = terserPkg.version;
  const minifyJsId = terserPkg.name + terserPkg.version + '_' + CACHE_BUSTER;

  const rollupPkg = require(join(opts.nodeModulesDir, 'rollup', 'package.json'));
  opts.rollupVersion = rollupPkg.version;
  const bundlerId = rollupPkg.name + rollupPkg.version + '_' + CACHE_BUSTER;

  const autoprefixerPkg = require(join(opts.nodeModulesDir, 'autoprefixer', 'package.json'));
  const cssnanoPkg = require(join(opts.nodeModulesDir, 'cssnano', 'package.json'));
  const postcssPkg = require(join(opts.nodeModulesDir, 'postcss', 'package.json'));

  const optimizeCssId = autoprefixerPkg.name + autoprefixerPkg.version + '_' + cssnanoPkg.name + cssnanoPkg.version + '_' + postcssPkg.name + postcssPkg.version + '_' + CACHE_BUSTER;

  return {
    '__BUILDID__': opts.buildId,
    '__BUILDID:BUNDLER__': bundlerId,
    '__BUILDID:MINIFYJS__': minifyJsId,
    '__BUILDID:OPTIMIZECSS__': optimizeCssId,
    '__BUILDID:TRANSPILE__': transpileId,

    '__VERSION:STENCIL__': opts.version,
    '__VERSION:ROLLUP__': rollupPkg.version,
    '__VERSION:TYPESCRIPT__': typescriptPkg.version,
    '__VERSION:TERSER__': terserPkg.version,

    '__VERMOJI__': opts.vermoji,
  };
}


export interface BuildOptions {
  rootDir?: string;
  srcDir?: string;
  nodeModulesDir?: string;
  transpiledDir?: string;
  scriptsDir?: string;
  scriptsBundlesDir?: string;
  bundleHelpersDir?: string;
  replaceData?: any;

  output?: {
    cliDir: string;
    compilerDir: string;
    devServerDir: string;
    internalDir: string;
    mockDocDir: string;
    screenshotDir: string;
    sysNodeDir: string;
    testingDir: string
  };

  version?: string;
  buildId?: string;
  isProd?: boolean;
  isPublishRelease?: boolean;
  isCI?: boolean,
  vermoji?: string;
  packageJsonPath?: string;
  changelogPath?: string;
  tag?: string;
  typescriptVersion?: string;
  rollupVersion?: string;
  terserVersion?: string;
}


export interface CmdLineArgs {
  'config-version'?: string;
  'config-build-id'?: string;
  'config-prod'?: string;
}


function getBuildId() {
  const d = new Date();
  return[
    d.getUTCFullYear() + '',
    ('0' + (d.getUTCMonth() + 1)).slice(-2),
    ('0' + d.getUTCDate()).slice(-2),
    ('0' + d.getUTCHours()).slice(-2),
    ('0' + d.getUTCMinutes()).slice(-2),
    ('0' + d.getUTCSeconds()).slice(-2)
  ].join('');
}
