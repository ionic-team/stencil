import { buildError, catchError, isString, normalizePath, hasError, IS_NODE_ENV } from '@utils';
import { CompilerSystem, Config, Diagnostic, LoadConfigInit, LoadConfigResults } from '../../declarations';
import { createLogger } from '../sys/logger';
import { createSystem } from '../sys/stencil-sys';
import { dirname, isAbsolute, join, resolve } from 'path';
import { loadTypescript } from '../sys/typescript/typescript-load';
import { validateConfig } from './validate-config';
import { validateTsConfig } from '../sys/typescript/typescript-config';
import tsTypes from 'typescript';


export const loadConfig = async (init: LoadConfigInit = {}) => {
  const results: LoadConfigResults = {
    config: null,
    diagnostics: [],
    tsconfig: {
      compilerOptions: null,
    },
  };

  try {
    const sys = init.sys || createSystem();
    const config = init.config || {};
    const cwd = sys.getCurrentDirectory();
    const tsPromise = loadTypescript(results.diagnostics, init.typescriptPath);
    let configPath = init.configPath || config.configPath;
    let isDefaultConfigPath = true;

    if (isString(configPath)) {
      if (!isAbsolute(configPath)) {
        // passed in a custom stencil config location
        // but it's relative, so prefix the cwd
        configPath = normalizePath(join(cwd, configPath));

      } else {
        // config path already an absolute path, we're good here
        configPath = normalizePath(configPath);
      }
      isDefaultConfigPath = false;

    } else {
      // nothing was passed in, use the current working directory
      configPath = normalizePath(cwd);
    }

    const loadedConfigFile = await loadConfigFile(sys, results.diagnostics, configPath, isDefaultConfigPath, init.typescriptPath);
    if (hasError(results.diagnostics)) {
      return results;
    }

    if (loadedConfigFile != null) {
      // merge the user's config object into their loaded config file
      configPath = loadedConfigFile.configPath;
      results.config = Object.assign(loadedConfigFile, config);
      results.config.configPath = configPath;
      results.config.rootDir = normalizePath(dirname(configPath));

    } else {
      // no stencil.config.ts or .js file, which is fine
      // #0CJS ¯\_(ツ)_/¯
      results.config = Object.assign({}, config);
      results.config.configPath = null;
      results.config.rootDir = normalizePath(cwd);
    }

    results.config.sys_next = sys;
    results.config.cwd = normalizePath(cwd);

    const validated = validateConfig(results.config);
    results.diagnostics.push(...validated.diagnostics);
    if (hasError(results.diagnostics)) {
      return results;
    }

    results.config = validated.config;

    if (results.config.flags.debug || results.config.flags.verbose) {
      results.config.logLevel = 'debug';

    } else if (results.config.flags.logLevel) {
      results.config.logLevel = results.config.flags.logLevel;

    } else if (typeof results.config.logLevel !== 'string') {
      results.config.logLevel = 'info';
    }

    results.config.logger = init.logger || results.config.logger || createLogger();
    results.config.logger.level = results.config.logLevel;

    const loadedTs = await tsPromise;
    if (!hasError(results.diagnostics)) {
      const tsConfigResults = await validateTsConfig(loadedTs, results.config, sys, init);
      results.diagnostics.push(...tsConfigResults.diagnostics);

      results.config.tsconfig = tsConfigResults.path;
      results.config.tsCompilerOptions = tsConfigResults.compilerOptions;
      results.tsconfig.compilerOptions = tsConfigResults.compilerOptions;
    }

    if (isString(init.typescriptPath)) {
      results.config.typescriptPath = init.typescriptPath;
    }

  } catch (e) {
    catchError(results.diagnostics, e);
  }

  return results;
};


const loadConfigFile = async (sys: CompilerSystem, diagnostics: Diagnostic[], configPath: string, isDefaultConfigPath: boolean, typescriptPath: string) => {
  let config: Config = null;

  let hasConfigFile = false;

  if (isString(configPath)) {
    const stat = await sys.stat(configPath);
    if (!stat && !isDefaultConfigPath) {
      const diagnostic = buildError(diagnostics);
      diagnostic.absFilePath = configPath;
      diagnostic.header = `Invalid config path`;
      diagnostic.messageText = `Config path "${configPath}" not found`;
      return null;
    }

    if (stat) {
      if (stat.isFile()) {
        hasConfigFile = true;

      } else if (stat.isDirectory()) {
        // this is only a directory, so let's make some assumptions
        for (const configName of CONFIG_FILENAMES) {
          const testConfigFilePath = join(configPath, configName);
          const stat = await sys.stat(testConfigFilePath);
          if (stat && stat.isFile()) {
            configPath = testConfigFilePath;
            hasConfigFile = true;
            break;
          }
        }
      }
    }
  }

  if (hasConfigFile) {
    // the passed in config was a string, so it's probably a path to the config we need to load
    // first clear the require cache so we don't get the same file
    const configFileData = await evaluateConfigFile(sys, diagnostics, configPath, typescriptPath);
    if (hasError(diagnostics)) {
      return config;
    }

    if (!configFileData.config) {
      const err = buildError(diagnostics);
      err.messageText = `Invalid Stencil configuration file "${configPath}". Missing "config" property.`;
      err.absFilePath = configPath;
      return config;
    }
    config = configFileData.config;
    config.configPath = normalizePath(configPath);
  }

  return config;
};

const CONFIG_FILENAMES = ['stencil.config.ts', 'stencil.config.js'];


const evaluateConfigFile = async (sys: CompilerSystem, diagnostics: Diagnostic[], configFilePath: string, typescriptPath: string) => {
  let configFileData: { config?: Config } = null;

  try {
    // TODO: this should use sys for resolving
    const ts = await loadTypescript(diagnostics, typescriptPath);

    if (IS_NODE_ENV) {
      // ensure we cleared out node's internal require() cache for this file
      delete require.cache[resolve(configFilePath)];

      // let's override node's require for a second
      // don't worry, we'll revert this when we're done
      require.extensions['.ts'] = (module: NodeModuleWithCompile, filename: string) => {
        let sourceText = sys.readFileSync(filename, 'utf8');

        if (configFilePath.endsWith('.ts')) {
          // looks like we've got a typed config file
          // let's transpile it to .js quick
          sourceText = transpileTypedConfig(ts, diagnostics, sourceText, configFilePath);

        } else {
          // quick hack to turn a modern es module
          // into and old school commonjs module
          sourceText = sourceText.replace(/export\s+\w+\s+(\w+)/gm, 'exports.$1');
        }

        module._compile(sourceText, filename);
      };

      // let's do this!
      configFileData = require(configFilePath);

      // all set, let's go ahead and reset the require back to the default
      require.extensions['.ts'] = undefined;

    } else {
      // browser environment, can't use node's require() to evaluate
      let sourceText = sys.readFileSync(configFilePath, 'utf8');
      sourceText = transpileTypedConfig(ts, diagnostics, sourceText, configFilePath);
      if (hasError(diagnostics)) {
        return configFileData;
      }

      const evalConfig = new Function(`const exports = {}; ${sourceText}; return exports;`);
      configFileData = evalConfig();
    }

  } catch (e) {
    catchError(diagnostics, e);
  }

  return configFileData;
};


const transpileTypedConfig = (ts: typeof tsTypes, diagnostics: Diagnostic[], sourceText: string, filePath: string) => {
  // let's transpile an awesome stencil.config.ts file into
  // a boring stencil.config.js file
  if (hasError(diagnostics)) {
    return sourceText;
  }

  const opts: tsTypes.TranspileOptions = {
    fileName: filePath,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES5,
      allowJs: true,
    },
    reportDiagnostics: false
  };

  const output = ts.transpileModule(sourceText, opts);

  return output.outputText;
};


interface NodeModuleWithCompile extends NodeModule {
  _compile(code: string, filename: string): any;
}
