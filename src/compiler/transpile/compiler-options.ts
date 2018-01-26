import { CompilerCtx, Config } from '../../declarations';
import * as ts from 'typescript';


export function getUserTsConfig(config: Config, compilerCtx: CompilerCtx): ts.CompilerOptions {
  let compilerOptions: ts.CompilerOptions = DEFAULT_COMPILER_OPTIONS;

  try {
    const sourceText = compilerCtx.fs.readFileSync(config.tsconfig);

    try {
      const sourceJson = JSON.parse(sourceText);
      const parsedCompilerOptions: ts.CompilerOptions = ts.convertCompilerOptionsFromJson(sourceJson.compilerOptions, '.').options;

      compilerOptions = {
        ...compilerOptions,
        ...parsedCompilerOptions
      };
    } catch (e) {
      config.logger.warn('tsconfig.json is malformed, using default settings');
    }
  } catch (e) {
    config.logger.warn('tsconfig.json is missing, using default settings');
  }

  // ensure that we do emit something
  compilerOptions.noEmitOnError = false;

  if (config._isTesting) {
    compilerOptions.module = ts.ModuleKind.CommonJS;
  }

  // apply user config to tsconfig
  compilerOptions.outDir = config.collectionDir;
  compilerOptions.rootDir = config.srcDir;

  // generate .d.ts files when generating a distribution and in prod mode
  compilerOptions.declaration = config.generateDistribution;

  if (config.generateDistribution) {
    compilerOptions.declarationDir = config.typesDir;
  }

  return compilerOptions;
}


export const DEFAULT_COMPILER_OPTIONS: ts.CompilerOptions = {

  // to allow jsx to work
  jsx: ts.JsxEmit.React,

  // the factory function to use
  jsxFactory: 'h',

  // transpileModule does not write anything to disk so there is no need
  // to verify that there are no conflicts between input and output paths.
  suppressOutputPathCheck: true,

  // // Clear out other settings that would not be used in transpiling this module
  lib: [
    'lib.dom.d.ts',
    'lib.es5.d.ts',
    'lib.es2015.d.ts',
    'lib.es2016.d.ts',
    'lib.es2017.d.ts'
  ],

  // We are not doing a full typecheck, we are not resolving the whole context,
  // so pass --noResolve to avoid reporting missing file errors.
  // noResolve: true,

  allowSyntheticDefaultImports: true,

  // must always allow decorators
  experimentalDecorators: true,

  // transpile down to es5
  target: ts.ScriptTarget.ES5,

  // create es2015 modules
  module: ts.ModuleKind.ES2015,

  // resolve using NodeJs style
  moduleResolution: ts.ModuleResolutionKind.NodeJs,

  // ensure that we do emit something
  noEmitOnError: false
};
