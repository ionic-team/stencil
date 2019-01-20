import * as d from '@declarations';
import { loadTypeScriptDiagnostic, normalizePath } from '@utils';
import { transpileModule } from '@compiler';
import ts from 'typescript';


export function transpile(input: string, opts: ts.CompilerOptions = {}, sourceFilePath?: string) {
  const config: d.Config = {
    cwd: process.cwd(),
    rootDir: '/',
    srcDir: '/',
    devMode: true,
    _isTesting: true,
    validateTypes: false
  };

  return transpileModule(config, input, opts, sourceFilePath);
}


export function getCompilerOptions(rootDir: string) {
  const opts: ts.CompilerOptions = getUserCompilerOptions(rootDir) || {};

  if (typeof opts.allowSyntheticDefaultImports !== 'boolean') {
    // best we always set this to true
    opts.allowSyntheticDefaultImports = true;
  }

  if (typeof opts.esModuleInterop !== 'boolean') {
    // best we always set this to true
    opts.esModuleInterop = true;
  }

  // always get source maps
  opts.sourceMap = true;

  // isolated per file transpiling
  opts.isolatedModules = true;

  // transpileModule does not write anything to disk so there is no need to verify that there are no conflicts between input and output paths.
  opts.suppressOutputPathCheck = true;

  // Filename can be non-ts file.
  opts.allowNonTsExtensions = true;

  // We are not returning a sourceFile for lib file when asked by the program,
  // so pass --noLib to avoid reporting a file not found error.
  opts.noLib = true;

  // Clear out other settings that would not be used in transpiling this module
  opts.lib = undefined;
  opts.types = undefined;
  opts.noEmit = undefined;
  opts.noEmitOnError = undefined;
  opts.paths = undefined;
  opts.rootDirs = undefined;
  opts.declaration = undefined;
  opts.declarationDir = undefined;
  opts.out = undefined;
  opts.outFile = undefined;

  // We are not doing a full typecheck, we are not resolving the whole context,
  // so pass --noResolve to avoid reporting missing file errors.
  opts.noResolve = true;

  // always use commonjs since we're in a node environment
  opts.module = ts.ModuleKind.CommonJS;

  // default to es2015
  opts.target = ts.ScriptTarget.ES2015;

  try {
    const v = process.version.replace('v', '').split('.');
    if (parseInt(v[0], 10) >= 10) {
      // let's go with ES2017 for node 10 and above
      opts.target = ts.ScriptTarget.ES2017;
    }
  } catch (e) {}

  return opts;
}


function getUserCompilerOptions(rootDir: string) {
  if (typeof rootDir !== 'string') {
    return null;
  }

  rootDir = normalizePath(rootDir);

  const tsconfigFilePath = ts.findConfigFile(rootDir, ts.sys.fileExists);
  if (!tsconfigFilePath) {
    return null;
  }

  const tsconfigResults = ts.readConfigFile(tsconfigFilePath, ts.sys.readFile);

  if (tsconfigResults.error) {
    throw new Error(formatDiagnostic(loadTypeScriptDiagnostic(null, tsconfigResults.error)));
  }

  const parseResult = ts.parseJsonConfigFileContent(tsconfigResults.config, ts.sys, rootDir, undefined, tsconfigFilePath);

  return parseResult.options;
}


export function formatDiagnostic(diagnostic: d.Diagnostic) {
  let m = '';

  if (diagnostic.relFilePath) {
    m += diagnostic.relFilePath;
    if (typeof diagnostic.lineNumber === 'number') {
      m += ':' + diagnostic.lineNumber + 1;
      if (typeof diagnostic.columnNumber === 'number') {
        m += ':' + diagnostic.columnNumber;
      }
    }
    m += '\n';
  }

  m += diagnostic.messageText;

  return m;
}
