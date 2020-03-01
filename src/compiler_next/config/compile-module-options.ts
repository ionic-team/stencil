import { CompileOptions, CompileResults, Config, TransformOptions } from '../../declarations';
import { isString } from '@utils';
import { STENCIL_INTERNAL_CLIENT_ID } from '../bundle/entry-alias-ids';
import path from 'path';
import ts from 'typescript';


export const getCompileConfig = (code: string, input: CompileOptions) => {
  const compileOpts: CompileOptions = {
    componentExport: getCompileConfigOpt(input.componentExport, VALID_EXPORT, 'customelement'),
    componentMetadata: getCompileConfigOpt(input.componentMetadata, VALID_METADATA, null),
    coreImportPath: isString(input.coreImportPath) ? input.coreImportPath : STENCIL_INTERNAL_CLIENT_ID,
    currentDirectory: isString(input.currentDirectory) ? input.currentDirectory : '/',
    data: input.data ? Object.assign({}, input.data) : null,
    file: (isString(input.file) ? input.file.trim() : 'module.tsx'),
    proxy: getCompileConfigOpt(input.proxy, VALID_PROXY, 'defineproperty'),
    module: getCompileConfigOpt(input.module, VALID_MODULE, 'esm'),
    sourceMap: input.sourceMap === 'inline' ? 'inline' : (input.sourceMap !== false),
    style: getCompileConfigOpt(input.style, VALID_STYLE, 'static'),
    target: getCompileConfigOpt(input.target || (input as any).script /* deprecated */, VALID_TARGET, 'latest'),
    typescriptPath: input.typescriptPath,
  };

  const tsCompilerOptions: ts.CompilerOptions = {
    // best we always set this to true
    allowSyntheticDefaultImports: true,

    // best we always set this to true
    esModuleInterop: true,

    // always get source maps
    sourceMap: (compileOpts.sourceMap !== false),

    // isolated per file transpiling
    isolatedModules: true,

    // transpileModule does not write anything to disk so there is no need to verify that there are no conflicts between input and output paths.
    suppressOutputPathCheck: true,

    // Filename can be non-ts file.
    allowNonTsExtensions: true,

    // We are not returning a sourceFile for lib file when asked by the program,
    // so pass --noLib to avoid reporting a file not found error.
    noLib: true,

    noResolve: true,

    // NOTE: "module" and "target" configs will be set later
    // after the "ts" object has been loaded
  };

  if (isString(input.baseUrl)) {
    compileOpts.baseUrl = input.baseUrl;
    tsCompilerOptions.baseUrl = compileOpts.baseUrl;
  }

  if (input.paths) {
    compileOpts.paths = { ...input.paths };
    tsCompilerOptions.paths = { ...compileOpts.paths };
  }

  const transformOpts: TransformOptions = {
    coreImportPath: compileOpts.coreImportPath,
    componentExport: compileOpts.componentExport as any,
    componentMetadata: compileOpts.componentMetadata as any,
    currentDirectory: compileOpts.currentDirectory,
    module: compileOpts.module as any,
    proxy: compileOpts.proxy as any,
    file: compileOpts.file,
    style: compileOpts.style as any,
    target: compileOpts.target as any,
  };

  const config: Config = {
    cwd: compileOpts.currentDirectory,
    rootDir: compileOpts.currentDirectory,
    srcDir: compileOpts.currentDirectory,
    devMode: true,
    _isTesting: true,
    validateTypes: false,
    enableCache: false,
    sys: {
      path: path
    },
    tsCompilerOptions,
  };

  const results: CompileResults = {
    code: (typeof code === 'string' ? code : ''),
    componentMeta: [],
    diagnostics: [],
    inputFileExtension: null,
    inputFilePath: compileOpts.file,
    inputOptions: compileOpts,
    imports: [],
    map: null,
    outputFilePath: null,
  };

  const parts = compileOpts.file.toLowerCase().split('.');
  results.inputFileExtension = parts[parts.length - 1];
  if (results.inputFileExtension === 'ts' && parts[parts.length - 2] === 'd') {
    results.inputFileExtension = 'd.ts';
  }

  return {
    compileOpts,
    config,
    results,
    transformOpts,
  };
};


const getCompileConfigOpt = (value: any, validValues: Set<string>, defaultValue: string) => {
  if (value === null || value === 'null') {
    return null;
  }
  value = (isString(value) ? value.toLowerCase().trim() : null);
  if (validValues.has(value)) {
    return value;
  }
  return defaultValue;
};

const VALID_EXPORT = new Set(['customelement', 'module']);
const VALID_METADATA = new Set(['compilerstatic', null]);
const VALID_MODULE = new Set(['cjs', 'esm']);
const VALID_PROXY = new Set(['defineproperty', null]);
const VALID_STYLE = new Set(['static']);
const VALID_TARGET = new Set(['latest', 'esnext', 'es2020', 'es2019', 'es2018', 'es2017', 'es2016', 'es2015', 'es5']);
