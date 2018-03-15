import * as d from '../../declarations';
import { IN_MEMORY_DIR } from '../../util/in-memory-fs';
import { normalizePath, pathJoin } from '../util';
import * as ts from 'typescript';


export async function getUserTsConfig(config: d.Config, compilerCtx: d.CompilerCtx) {
  let compilerOptions: ts.CompilerOptions = Object.assign({}, DEFAULT_COMPILER_OPTIONS);

  try {
    const normalizedConfigPath = normalizePath(config.tsconfig);

    const sourceText = await compilerCtx.fs.readFile(normalizedConfigPath);

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

  if (config._isTesting) {
    compilerOptions.module = ts.ModuleKind.CommonJS;
  }

  // apply user config to tsconfig
  compilerOptions.rootDir = config.srcDir;

  const collectionOutputTarget = (config.outputTargets as d.OutputTargetDist[]).find(o => !!o.collectionDir);
  if (collectionOutputTarget) {
    compilerOptions.outDir = collectionOutputTarget.collectionDir;

  } else {
    compilerOptions.outDir = pathJoin(config, config.rootDir, IN_MEMORY_DIR);
  }


  // generate .d.ts files when generating a distribution and in prod mode
  const typesOutputTarget = (config.outputTargets as d.OutputTargetDist[]).find(o => !!o.typesDir);
  if (typesOutputTarget) {
    compilerOptions.declaration = true;
    compilerOptions.declarationDir = typesOutputTarget.typesDir;

  } else {
    compilerOptions.declaration = false;
  }

  validateCompilerOptions(compilerOptions);

  return compilerOptions;
}


function validateCompilerOptions(compilerOptions: ts.CompilerOptions) {

  if (compilerOptions.allowJs && compilerOptions.declaration) {
    compilerOptions.allowJs = false;
  }

  // triple stamp a double stamp we've got the required settings
  compilerOptions.jsx = DEFAULT_COMPILER_OPTIONS.jsx;
  compilerOptions.jsxFactory = DEFAULT_COMPILER_OPTIONS.jsxFactory;
  compilerOptions.experimentalDecorators = DEFAULT_COMPILER_OPTIONS.experimentalDecorators;
  compilerOptions.noEmitOnError = DEFAULT_COMPILER_OPTIONS.noEmit;
  compilerOptions.suppressOutputPathCheck = DEFAULT_COMPILER_OPTIONS.suppressOutputPathCheck;
  compilerOptions.module = DEFAULT_COMPILER_OPTIONS.module;
  compilerOptions.moduleResolution = DEFAULT_COMPILER_OPTIONS.moduleResolution;

  if (compilerOptions.target === ts.ScriptTarget.ES3 || compilerOptions.target === ts.ScriptTarget.ES5) {
    compilerOptions.target = DEFAULT_COMPILER_OPTIONS.target;
  }
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

  // transpile down to es2015
  target: ts.ScriptTarget.ES2015,

  // create es2015 modules
  module: ts.ModuleKind.ES2015,

  // resolve using NodeJs style
  moduleResolution: ts.ModuleResolutionKind.NodeJs,

  // ensure that we do emit something
  noEmitOnError: false
};
