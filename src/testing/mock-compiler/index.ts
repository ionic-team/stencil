/** Note - keep this in it's own folder.
 * This stops typescript attempting to read more files than necessary. */

import type * as d from '@stencil/core/internal';
import { createCompiler, loadConfig } from '@stencil/core/compiler';
import path from 'path';
import { mockConfig } from '../../testing/mocks';
import { createNodeSys } from '../../sys/node';
import { validateConfig } from '../../compiler/config/validate-config';
import { createSystem } from '../../compiler/sys/stencil-sys';
import { hasError } from '@utils';

export interface MockCompiler extends d.Compiler {
  config: d.Config;
}

// jest will run tests in parallel by default but
// there can only be one compiler instance at a time.
// We use this to queue new compiler setup requests.
let currentCompilerResolve: (value?: any) => void;
let currentCompiler: Promise<any> = null;

// cache some original file systems functions that we will overwrite.
// We use them to continue to refer to real, on-disk files
const sys = createNodeSys({ process: process });
const ogReadFile = sys.readFile;
const ogReadFileSync = sys.readFileSync;
const ogReadDir = sys.readDir;
const ogReadDirSync = sys.readDirSync;
const ogCopyFile = sys.copyFile;
const ogStat = sys.stat;
const ogStatSync = sys.statSync;

/**
 * The root path of the compiler instance. Useful when writing new in-memory files
 */
export const mockCompilerRoot: mockCompilerRoot = path.resolve(__dirname);
// idk what's happening here. No declaration is made (so throws error) unless I export this :/
export type mockCompilerRoot = string;

/**
 * Setup sensible compiler config defaults which can then be
 * overwritten and used with `mockCreateCompiler()`. Also creates a hybrid fileSystem;
 * reads from disk - required for typescript - and write to memory (`config.sys`).
 * @returns a stencil Config object
 */
export function initCompilerConfig(setupFs = true) {
  let config: d.Config = {};
  const root = mockCompilerRoot;

  config = mockConfig(setupFs ? patchHybridFs() : null, root);
  config._internalTesting = true;
  config.namespace = `TestApp`;
  config.rootDir = root;
  config.buildEs5 = false;
  config.buildAppCore = false;
  config.validateTypes = true;
  config.sourceMap = false;
  config.watch = false;
  config.enableCache = false;
  config.flags.watch = false;
  config.flags.build = true;
  config.outputTargets = [{ type: 'www' }];
  config.srcDir = path.join(root, 'src');
  config.tsconfig = path.join(root, 'tsconfig.json');
  config.packageJsonFilePath = path.join(root, 'package.json');

  return config;
}

/**
 * A testing utility to create a suitable environement to test stencil's `compiler` functionality.
 * Creates sensible config defaults & boilerplate files.
 * Also creates a hybrid fileSystem; reads from disk - required for typescript - and write to memory.
 * @param userConfig - config object. Will get merged & override a sensible defaults config.
 * @returns a mock compiler object - same as a normal compiler with an accompanying final config
 */
export async function mockCreateCompiler(userConfig: d.Config = {}): Promise<MockCompiler> {
  if (currentCompiler) {
    await currentCompiler;
  }
  currentCompiler = new Promise((resolve) => {
    currentCompilerResolve = resolve;
  });

  let config: d.Config = initCompilerConfig(!userConfig.sys);
  config = { ...config, ...userConfig };

  // Some default files to smooth things along. They can be overwritten
  await config.sys.createDir(path.join(config.srcDir, 'components'), { recursive: true });

  if (config.tsconfig && !config.sys.readFileSync(config.tsconfig)) {
    config.sys.writeFileSync(
      config.tsconfig,
      `{
        "extends": "../tsconfig.internal.json",
        "include": ["./src"],
        "exclude": ["index.ts"]
      }`
    );
  }

  if (config.packageJsonFilePath && !config.sys.readFileSync(config.packageJsonFilePath)) {
    config.sys.writeFileSync(
      config.packageJsonFilePath,
      `{
        "module": "dist/index.js",
        "main": "dist/index.cjs.js",
        "collection": "dist/collection/collection-manifest.json",
        "types": "dist/types/components.d.ts"
      }`
    );
  }
  if (!config.sys.readFileSync(path.join(config.rootDir, 'stencil.config.js'))) {
    config.sys.writeFileSync(path.join(config.rootDir, 'stencil.config.js'), `exports.config = {};`);
  }
  if (!config.sys.readFileSync(path.join(config.rootDir, 'index.html'))) {
    config.sys.writeFileSync(path.join(config.srcDir, 'index.html'), ``);
  }

  // belts and brances config validation
  const loadedConfig = await loadConfig({
    config,
    initTsConfig: false,
    sys: config.sys,
  });
  if (!loadedConfig || hasError(loadedConfig.diagnostics)) {
    throw loadedConfig.diagnostics;
  } else {
    config = loadedConfig.config;
  }

  config = validateConfig(config).config;

  // Ready to create the compiler instance. Config is baked-in at this point.
  const compiler = await createCompiler(config);

  // augment destroy to clean-up our in-memory files
  const ogDestroy = compiler.destroy;
  compiler.destroy = async () => {
    config.sys.removeDirSync(config.rootDir, { recursive: true });
    await ogDestroy();
    currentCompilerResolve();
  };

  // this helps consumers read files easily from our virtual root
  // config.rootDir = path.join(config.rootDir, config.namespace);
  return { config, ...compiler };
}

/**
 * A typescript Compiler Host - used when we `compiler.build()` - expects to be within
 * a real, file structure, on disk but when testing we don't want to write files to disk.
 * This patches a real disk fileSystem;
 * allows reads to be done of real files whilst any writes are done in memory.
 * @returns a file system that reads real files and writes all new files to memory
 */
function patchHybridFs() {
  const memSys = createSystem();

  sys.getCompilerExecutingPath = () => path.join(mockCompilerRoot, '../../../compiler/stencil.js');

  sys.writeFile = (p: string, content: string) => {
    return memSys.writeFile(p, content);
  };
  sys.writeFileSync = (p: string, content: string) => {
    return memSys.writeFileSync(p, content);
  };
  sys.readFile = async (p: string, encoding?: any) => {
    const foundReadFile = await memSys.readFile(p, encoding);
    if (foundReadFile) return foundReadFile;
    else return ogReadFile(p, encoding);
  };
  sys.readFileSync = (p: string, encoding?: any) => {
    const foundReadFile = memSys.readFileSync(p, encoding);
    if (foundReadFile) return foundReadFile;
    else return ogReadFileSync(p, encoding);
  };
  sys.copyFile = async (src: string, dst: string) => {
    const foundReadFile = await memSys.readFile(src);
    if (foundReadFile) return memSys.copyFile(src, dst);
    else return ogCopyFile(src, dst);
  };
  sys.readDir = async (p: string) => {
    return [...(await ogReadDir(p)), ...(await memSys.readDir(p))];
  };
  sys.readDirSync = (p: string) => {
    return [...ogReadDirSync(p), ...memSys.readDirSync(p)];
  };
  sys.createDir = async (p: string, opts?: d.CompilerSystemCreateDirectoryOptions) => {
    return memSys.createDir(p, opts);
  };
  sys.createDirSync = (p: string, opts?: d.CompilerSystemCreateDirectoryOptions) => {
    return memSys.createDirSync(p, opts);
  };
  sys.stat = async (p: string) => {
    // in-memory fs doesn't seem to normalize for query params
    if (p.includes('?')) {
      let { dir, ext, name } = path.parse(p);
      p = path.join(dir, name + ext.split('?')[0]);
    }
    const foundReadFile = await memSys.stat(p);
    if (!foundReadFile.error) {
      return foundReadFile;
    } else return ogStat(p);
  };
  sys.statSync = (p: string) => {
    // in-memory fs doesn't seem to normalize query params
    if (p.includes('?')) {
      let { dir, ext, name } = path.parse(p);
      p = path.join(dir, name + ext.split('?')[0]);
    }
    const foundReadFile = memSys.statSync(p);
    if (!foundReadFile.error) {
      return foundReadFile;
    } else return ogStatSync(p);
  };
  sys.removeFile = (p: string) => {
    return memSys.removeFile(p);
  };
  sys.removeFileSync = (p: string) => {
    return memSys.removeFileSync(p);
  };
  sys.removeDir = (p: string, opts?: d.CompilerSystemRemoveDirectoryOptions) => {
    return memSys.removeDir(p, opts);
  };
  sys.removeDirSync = (p: string, opts?: d.CompilerSystemRemoveDirectoryOptions) => {
    return memSys.removeDirSync(p, opts);
  };

  return sys;
}
