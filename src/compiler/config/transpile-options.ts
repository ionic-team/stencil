import type {
  TranspileOptions,
  TranspileResults,
  Config,
  TransformOptions,
  TransformCssToEsmInput,
  ImportData,
  CompilerSystem,
} from '../../declarations';
import { createSystem } from '../sys/stencil-sys';
import { IS_DENO_ENV, IS_NODE_ENV, requireFunc } from '../sys/environment';
import { isString } from '@utils';
import { parseImportPath } from '../transformers/stencil-import-path';
import { STENCIL_INTERNAL_CLIENT_ID } from '../bundle/entry-alias-ids';
import type { CompilerOptions } from 'typescript';

export const getTranspileResults = (code: string, input: TranspileOptions) => {
  if (!isString(input.file)) {
    input.file = 'module.tsx';
  }
  const parsedImport = parseImportPath(input.file);

  const results: TranspileResults = {
    code: typeof code === 'string' ? code : '',
    data: [],
    diagnostics: [],
    inputFileExtension: parsedImport.ext,
    inputFilePath: input.file,
    imports: [],
    map: null,
    outputFilePath: null,
  };

  return {
    importData: parsedImport.data,
    results,
  };
};

const transpileCtx = { sys: null as CompilerSystem };

export const getTranspileConfig = (input: TranspileOptions) => {
  if (input.sys) {
    transpileCtx.sys = input.sys;
  } else if (!transpileCtx.sys) {
    if (IS_NODE_ENV) {
      transpileCtx.sys = requireFunc('../sys/node/index.js').createNodeSys();
    } else if (IS_DENO_ENV) {
      throw new Error(`"sys" must be provided in options`);
    } else {
      transpileCtx.sys = createSystem();
    }
  }

  const compileOpts: TranspileOptions = {
    componentExport: getTranspileConfigOpt(input.componentExport, VALID_EXPORT, 'customelement'),
    componentMetadata: getTranspileConfigOpt(input.componentMetadata, VALID_METADATA, null),
    coreImportPath: isString(input.coreImportPath) ? input.coreImportPath : STENCIL_INTERNAL_CLIENT_ID,
    currentDirectory: isString(input.currentDirectory)
      ? input.currentDirectory
      : transpileCtx.sys.getCurrentDirectory(),
    file: input.file,
    proxy: getTranspileConfigOpt(input.proxy, VALID_PROXY, 'defineproperty'),
    module: getTranspileConfigOpt(input.module, VALID_MODULE, 'esm'),
    sourceMap: input.sourceMap === 'inline' ? 'inline' : input.sourceMap !== false,
    style: getTranspileConfigOpt(input.style, VALID_STYLE, 'static'),
    styleImportData: getTranspileConfigOpt(input.styleImportData, VALID_STYLE_IMPORT_DATA, 'queryparams'),
    target: getTranspileConfigOpt(input.target, VALID_TARGET, 'latest'),
  };

  const tsCompilerOptions: CompilerOptions = {
    // best we always set this to true
    allowSyntheticDefaultImports: true,

    // best we always set this to true
    esModuleInterop: true,

    // always get source maps
    sourceMap: compileOpts.sourceMap !== false,

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
    isolatedModules: true,
    module: compileOpts.module as any,
    proxy: compileOpts.proxy as any,
    file: compileOpts.file,
    style: compileOpts.style as any,
    styleImportData: compileOpts.styleImportData as any,
    target: compileOpts.target as any,
  };

  const config: Config = {
    rootDir: compileOpts.currentDirectory,
    srcDir: compileOpts.currentDirectory,
    devMode: true,
    minifyCss: true,
    minifyJs: false,
    _isTesting: true,
    validateTypes: false,
    enableCache: false,
    sys: transpileCtx.sys,
    tsCompilerOptions,
  };

  return {
    compileOpts,
    config,
    transformOpts,
  };
};

export const getTranspileCssConfig = (
  compileOpts: TranspileOptions,
  importData: ImportData,
  results: TranspileResults
) => {
  const transformInput: TransformCssToEsmInput = {
    file: results.inputFilePath,
    input: results.code,
    tag: importData && importData.tag,
    encapsulation: importData && importData.encapsulation,
    mode: importData && importData.mode,
    sourceMap: compileOpts.sourceMap !== false,
    commentOriginalSelector: false,
    minify: false,
    autoprefixer: false,
    module: compileOpts.module,
    styleImportData: compileOpts.styleImportData,
  };
  return transformInput;
};

const getTranspileConfigOpt = (value: any, validValues: Set<string>, defaultValue: string) => {
  if (value === null || value === 'null') {
    return null;
  }
  value = isString(value) ? value.toLowerCase().trim() : null;
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
const VALID_STYLE_IMPORT_DATA = new Set(['queryparams']);
const VALID_TARGET = new Set(['latest', 'esnext', 'es2020', 'es2019', 'es2018', 'es2017', 'es2016', 'es2015', 'es5']);
