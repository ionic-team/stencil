import type { CompilerSystem, Config, Diagnostic, LoadConfigInit, LoadConfigResults } from '../../declarations';
import { buildError, catchError, isString, normalizePath, hasError, IS_NODE_ENV } from '@utils';
import { createLogger } from '../sys/logger/console-logger';
import { createSystem } from '../sys/stencil-sys';
import { dirname, resolve } from 'path';
import { loadTypescript } from '../sys/typescript/typescript-load';
import { validateConfig } from './validate-config';
import { validateTsConfig } from '../sys/typescript/typescript-config';
import type TypeScript from 'typescript';

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
    let configPath = init.configPath || config.configPath;

    const loadedTs = await loadTypescript(sys, init.typescriptPath, false);

    const loadedConfigFile = await loadConfigFile(loadedTs, sys, results.diagnostics, configPath);
    if (hasError(results.diagnostics)) {
      return results;
    }

    if (loadedConfigFile != null) {
      // merge the user's config object into their loaded config file
      configPath = loadedConfigFile.configPath;
      results.config = { ...loadedConfigFile, ...config };
      results.config.configPath = configPath;
      results.config.rootDir = normalizePath(dirname(configPath));
    } else {
      // no stencil.config.ts or .js file, which is fine
      // #0CJS ¯\_(ツ)_/¯
      results.config = { ...config };
      results.config.configPath = null;
      results.config.rootDir = normalizePath(sys.getCurrentDirectory());
    }

    results.config.sys = sys;

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
    results.config.logger.setLevel(results.config.logLevel);

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

const loadConfigFile = async (loadedTs: typeof TypeScript, sys: CompilerSystem, diagnostics: Diagnostic[], configPath: string) => {
  let config: Config = null;

  if (isString(configPath)) {
    // the passed in config was a string, so it's probably a path to the config we need to load
    const configFileData = await evaluateConfigFile(loadedTs, sys, diagnostics, configPath);
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

const evaluateConfigFile = async (loadedTs: typeof TypeScript, sys: CompilerSystem, diagnostics: Diagnostic[], configFilePath: string) => {
  let configFileData: { config?: Config } = null;

  try {
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
          sourceText = transpileTypedConfig(loadedTs, diagnostics, sourceText, configFilePath);
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
      let sourceText = await sys.readFile(configFilePath);
      sourceText = transpileTypedConfig(loadedTs, diagnostics, sourceText, configFilePath);
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

const transpileTypedConfig = (loadedTs: typeof TypeScript, diagnostics: Diagnostic[], sourceText: string, filePath: string) => {
  // let's transpile an awesome stencil.config.ts file into
  // a boring stencil.config.js file
  if (hasError(diagnostics)) {
    return sourceText;
  }

  const opts: TypeScript.TranspileOptions = {
    fileName: filePath,
    compilerOptions: {
      module: loadedTs.ModuleKind.CommonJS,
      moduleResolution: loadedTs.ModuleResolutionKind.NodeJs,
      esModuleInterop: true,
      target: loadedTs.ScriptTarget.ES2015,
      allowJs: true,
    },
    reportDiagnostics: false,
  };

  const output = loadedTs.transpileModule(sourceText, opts);

  return output.outputText;
};

interface NodeModuleWithCompile extends NodeModule {
  _compile(code: string, filename: string): any;
}
