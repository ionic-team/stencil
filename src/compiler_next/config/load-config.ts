import { buildError, catchError, normalizePath } from '@utils';
import { CompilerSystem, Config, Diagnostic } from '../../declarations';
import { createLogger } from '../sys/logger';
import { createStencilSys } from '../sys/stencil-sys';
import { loadTypescript } from '../sys/typescript/typescript-load';
import { IS_NODE_ENV } from '../sys/environment';
import { validateConfig } from './validate-config';
import path from 'path';
import tsTypes from 'typescript';


export const loadConfig = async (config: Config = {}) => {
  const flags = config.flags = config.flags || {};
  let configPath = flags.config || config.configPath;

  const results: { config: Config; diagnostics: Diagnostic[] } = {
    config: null,
    diagnostics: []
  };

  try {
    const sys = config.sys_next || createStencilSys();
    const logger = config.logger || createLogger();
    const cwd = sys.getCurrentDirectory();

    if (configPath) {
      if (!path.isAbsolute(configPath)) {
        // passed in a custom stencil config location
        // but it's relative, so prefix the cwd
        configPath = normalizePath(path.join(cwd, configPath));

      } else {
        // config path already an absolute path, we're good here
        configPath = normalizePath(configPath);
      }
    } else {
      // nothing was passed in, use the current working directory
      configPath = normalizePath(cwd);
    }

    const loadedConfigFile = await loadConfigFile(sys, results.diagnostics, configPath);
    if (results.diagnostics.length > 0) {
      return results;
    }

    if (loadedConfigFile) {
      // merge the user's config object into their loaded config file
      configPath = loadedConfigFile.configPath;
      results.config = Object.assign(loadedConfigFile, config);
      results.config.configPath = configPath;
      results.config.rootDir = normalizePath(path.dirname(configPath));

    } else {
      // no stencil.config.ts or .js file, which is fine
      // #0CJS ¯\_(ツ)_/¯
      results.config = {
        rootDir: normalizePath(cwd)
      };
    }

    results.config.cwd = normalizePath(cwd);

    const validated = validateConfig(results.config);
    results.diagnostics.push(...validated.diagnostics);
    if (results.diagnostics.length > 0) {
      return results;
    }

    results.config = validated.config;

    validated.config.logger = logger;

    if (validated.config.flags.debug || validated.config.flags.verbose) {
      validated.config.logLevel = 'debug';

    } else if (validated.config.flags.logLevel) {
      validated.config.logLevel = validated.config.flags.logLevel;

    } else if (typeof validated.config.logLevel !== 'string') {
      validated.config.logLevel = 'info';
    }

    validated.config.logger.level = validated.config.logLevel;

  } catch (e) {
    catchError(results.diagnostics, e);
  }

  return results;
};

export interface LoadConfigOptions {
  sys?: CompilerSystem;
  cwd?: string;
  configPath?: string;
}


const loadConfigFile = async (sys: CompilerSystem, diagnostics: Diagnostic[], configPath: string) => {
  let config: Config = null;

  let hasConfigFile = false;

  if (typeof configPath === 'string') {
    try {
      const stat = await sys.stat(configPath);
      if (stat.isFile()) {
        hasConfigFile = true;

      } else if (stat.isDirectory()) {
        // this is only a directory, so let's make some assumptions
        for (const configName of CONFIG_FILENAMES) {
          try {
            const testConfigFilePath = path.join(configPath, configName);
            const stat = await sys.stat(testConfigFilePath);
            if (stat.isFile()) {
              configPath = testConfigFilePath;
              hasConfigFile = true;
              break;
            }
          } catch (e) {}
        }
      }
    } catch (e) {}
  }

  if (hasConfigFile) {
    // the passed in config was a string, so it's probably a path to the config we need to load
    // first clear the require cache so we don't get the same file
    const configFileData = evaluateConfigFile(sys, diagnostics, configPath);
    if (diagnostics.length > 0) {
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


const evaluateConfigFile = (sys: CompilerSystem, diagnostics: Diagnostic[], configFilePath: string) => {
  let configFileData: { config?: Config } = null;

  try {
    if (IS_NODE_ENV) {
      // ensure we cleared out node's internal require() cache for this file
      delete require.cache[path.resolve(configFilePath)];

      // let's override node's require for a second
      // don't worry, we'll revert this when we're done
      require.extensions['.ts'] = (module: NodeModuleWithCompile, filename: string) => {
        let sourceText = sys.readFileSync(filename, 'utf8');

        if (configFilePath.endsWith('.ts')) {
          // looks like we've got a typed config file
          // let's transpile it to .js quick
          sourceText = transpileTypedConfig(diagnostics, sourceText, configFilePath);

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
      if (configFilePath.endsWith('.ts')) {
        // looks like we've got a typed config file
        // let's transpile it to .js quick
        sourceText = transpileTypedConfig(diagnostics, sourceText, configFilePath);
        if (diagnostics.length > 0) {
          return configFileData;
        }
      }

      const evalConfig = new Function(`const exports = {}; ${sourceText}; return exports;`);
      configFileData = evalConfig();
    }

  } catch (e) {
    catchError(diagnostics, e);
  }

  return configFileData;
};


const transpileTypedConfig = (diagnostics: Diagnostic[], sourceText: string, filePath: string) => {
  // let's transpile an awesome stencil.config.ts file into
  // a boring stencil.config.js file
  const ts = loadTypescript(diagnostics);
  if (diagnostics.length > 0) {
    return sourceText;
  }

  const opts: tsTypes.TranspileOptions = {
    fileName: filePath,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES5
    },
    reportDiagnostics: false
  };

  const output = ts.transpileModule(sourceText, opts);

  return output.outputText;
};


interface NodeModuleWithCompile extends NodeModule {
  _compile(code: string, filename: string): any;
}
