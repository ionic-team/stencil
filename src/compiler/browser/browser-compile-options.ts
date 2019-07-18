import * as d from '../../declarations';
import { getTerserOptions } from '../app-core/optimize-module';
import path from 'path';
import ts from 'typescript';


export const getCompileOptions = (input: d.CompileOptions) => {
  const rtn: d.CompileOptions = {
    componentExport: (typeof input.componentExport === 'string' ? input.componentExport.toLowerCase().trim() : ''),
    componentMetadata: (typeof input.componentMetadata === 'string' ? input.componentMetadata.toLowerCase().trim() : ''),
    module: (typeof input.module === 'string' ? input.module.toLowerCase().trim() : ''),
    script: (typeof input.script === 'string' ? input.script.toLowerCase().trim() : ''),
    styleImport: (typeof input.styleImport === 'string' ? input.styleImport.toLowerCase().trim() : '')
  };

  if (!VALID_METADATA.has(rtn.componentMetadata)) {
    rtn.componentMetadata = 'proxy';
  }

  if (!VALID_OUTPUT.has(rtn.componentExport)) {
    rtn.componentExport = 'customelement';
  }

  if (!VALID_STYLE_IMPORT.has(rtn.styleImport)) {
    rtn.styleImport = 'inline';
  }

  return rtn;
};


const VALID_METADATA = new Set(['pending', 'static']);
const VALID_OUTPUT = new Set(['customelement', 'module']);
const VALID_STYLE_IMPORT = new Set(['cjs', 'esm', 'inline']);


export const getTransformOptions = (compilerOpts: d.CompileOptions) => {
  const transformOpts: d.TransformOptions = {

    // best we always set this to true
    allowSyntheticDefaultImports: true,

    // best we always set this to true
    esModuleInterop: true,

    // always get source maps
    sourceMap: true,

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

    coreImportPath: '@stencil/core/internal/client',
    componentMetadata: compilerOpts.componentMetadata as any,
    styleImport: compilerOpts.styleImport as any,
  };

  if (compilerOpts.module === 'cjs' || compilerOpts.module === 'commonjs') {
    compilerOpts.module = 'cjs';
    transformOpts.module = ts.ModuleKind.CommonJS;

  } else {
    compilerOpts.module = 'esm';
    transformOpts.module = ts.ModuleKind.ES2015;
  }

  if (compilerOpts.script === 'esnext') {
    transformOpts.target = ts.ScriptTarget.ESNext;

  } else if (compilerOpts.script === 'latest') {
    transformOpts.target = ts.ScriptTarget.Latest;

  } else if (compilerOpts.script === 'es2015') {
    transformOpts.target = ts.ScriptTarget.ES2015;

  } else if (compilerOpts.script === 'es5') {
    transformOpts.target = ts.ScriptTarget.ES5;

  } else {
    transformOpts.target = ts.ScriptTarget.ES2017;
    compilerOpts.script = 'es2017';
  }

  if (compilerOpts.componentExport === 'lazy') {
    transformOpts.componentExport = 'lazy';

  } else if (compilerOpts.componentExport === 'module') {
    transformOpts.componentExport = 'native';

  } else {
    transformOpts.componentExport = 'customelement';
  }

  return transformOpts;
};


export const getCompilerConfig = () => {
  const config: d.Config = {
    cwd: '/',
    rootDir: '/',
    srcDir: '/',
    devMode: true,
    _isTesting: true,
    validateTypes: false,
    enableCache: false,
    sys: {
      path: path
    }
  };

  return config;
};


export const getMinifyScriptOptions = (opts: d.CompileScriptMinifyOptions) => {
  const sourceTarget: d.SourceTarget = (opts.script === 'es5') ? 'es5' : 'es2017';
  const isPretty = !!opts.pretty;
  return getTerserOptions(sourceTarget, isPretty);
};
