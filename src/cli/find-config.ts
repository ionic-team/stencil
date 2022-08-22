import type { CompilerSystem, Diagnostic } from '../declarations';
import { isString, normalizePath, buildError } from '@utils';

/**
 * An object containing the {@link CompilerSystem} used to find the configuration file, as well as the location on disk
 * to search for a Stencil configuration
 */
export type FindConfigOptions = {
  sys: CompilerSystem;
  configPath: string;
};

/**
 * The results of attempting to find a Stencil configuration file on disk
 */
export type FindConfigResults = {
  configPath: string;
  rootDir: string;
  diagnostics: Diagnostic[];
};

/**
 * Attempt to find a Stencil configuration file on the file system
 * @param opts the options needed to find the configuration file
 * @returns the results of attempting to find a configuration file on disk
 */
export const findConfig = async (opts: FindConfigOptions): Promise<FindConfigResults> => {
  const sys = opts.sys;
  const cwd = sys.getCurrentDirectory();
  const results: FindConfigResults = {
    configPath: null as string,
    rootDir: normalizePath(cwd),
    diagnostics: [],
  };
  let configPath = opts.configPath;

  if (isString(configPath)) {
    if (!sys.platformPath.isAbsolute(configPath)) {
      // passed in a custom stencil config location,
      // but it's relative, so prefix the cwd
      configPath = normalizePath(sys.platformPath.join(cwd, configPath));
    } else {
      // config path already an absolute path, we're good here
      configPath = normalizePath(opts.configPath);
    }
  } else {
    // nothing was passed in, use the current working directory
    configPath = results.rootDir;
  }

  const stat = await sys.stat(configPath);
  if (stat.error) {
    const diagnostic = buildError(results.diagnostics);
    diagnostic.absFilePath = configPath;
    diagnostic.header = `Invalid config path`;
    diagnostic.messageText = `Config path "${configPath}" not found`;
    return results;
  }

  if (stat.isFile) {
    results.configPath = configPath;
    results.rootDir = sys.platformPath.dirname(configPath);
  } else if (stat.isDirectory) {
    // this is only a directory, so let's make some assumptions
    for (const configName of ['stencil.config.ts', 'stencil.config.js']) {
      const testConfigFilePath = sys.platformPath.join(configPath, configName);
      const stat = await sys.stat(testConfigFilePath);
      if (stat.isFile) {
        results.configPath = testConfigFilePath;
        results.rootDir = sys.platformPath.dirname(testConfigFilePath);
        break;
      }
    }
  }

  return results;
};
