import * as d from '../../declarations';
import path from 'path';
import ts from 'typescript';


export const getCompileOptions = (input: d.CompileOptions) => {
  const rtn: d.CompileOptions = {
    metadata: (typeof input.metadata === 'string' ? input.metadata.toLowerCase().trim() : ''),
    mode: (typeof input.mode === 'string' ? input.mode.toLowerCase().trim() : ''),
    module: (typeof input.module === 'string' ? input.module.toLowerCase().trim() : ''),
    output: (typeof input.output === 'string' ? input.output.toLowerCase().trim() : ''),
    script: (typeof input.script === 'string' ? input.script.toLowerCase().trim() : ''),
    styleImport: (typeof input.styleImport === 'string' ? input.styleImport.toLowerCase().trim() : '')
  };

  if (!VALID_METADATA.has(rtn.metadata)) {
    rtn.metadata = 'proxy';
  }

  if (!VALID_MODE.has(rtn.mode)) {
    rtn.mode = 'dev';
  }

  if (!VALID_OUTPUT.has(rtn.output)) {
    rtn.output = 'customelement';
  }

  if (!VALID_STYLE_IMPORT.has(rtn.styleImport)) {
    rtn.styleImport = 'inline';
  }

  return rtn;
};


const VALID_METADATA = new Set(['pending', 'static']);
const VALID_MODE = new Set(['prod', 'dev']);
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
    metadata: compilerOpts.metadata as any,
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

  } else if (compilerOpts.script === 'es2017') {
    transformOpts.target = ts.ScriptTarget.ES2017;

  } else if (compilerOpts.script === 'es2015') {
    transformOpts.target = ts.ScriptTarget.ES2015;

  } else if (compilerOpts.script === 'es5') {
    transformOpts.target = ts.ScriptTarget.ES5;

  } else {
    compilerOpts.script = 'latest';
    transformOpts.target = ts.ScriptTarget.Latest;
  }

  if (compilerOpts.output === 'lazy') {
    transformOpts.transformOutput = 'lazy';

  } else if (compilerOpts.output === 'module') {
    transformOpts.transformOutput = 'native';

  } else {
    transformOpts.transformOutput = 'customelement';
  }

  return transformOpts;
};


export const getCompilerConfig = (opts: d.CompileOptions) => {
  const config: d.Config = {
    cwd: '/',
    rootDir: '/',
    srcDir: '/',
    devMode: (opts.mode === 'dev'),
    _isTesting: true,
    validateTypes: false,
    enableCache: false,
    sys: {
      path: path
    }
  };

  return config;
};
