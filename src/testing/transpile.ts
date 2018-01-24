import { Config, Diagnostic } from '../declarations';
import { transpileModule } from '../compiler/transpile/transpile';
import ts from 'typescript';


const TEST_CONFIG: Config = {
  sys: {
    path: require('path'),
    url: require('url'),
    vm: require('vm')
  },
  rootDir: '/'
};


export function transpile(input: string, opts: TranspileOptions = {}, path?: string) {
  const results: TranspileResults = { diagnostics: null, code: null };

  if (!opts.module) {
    opts.module = 'CommonJS';
  }

  const compilerOpts: ts.CompilerOptions = Object.assign({}, opts as any);

  if (!path) {
    path = '/tmp/transpile-path.tsx';
  }

  const transpileResults = transpileModule(TEST_CONFIG, compilerOpts, path, input);

  results.code = transpileResults.code;
  results.diagnostics = transpileResults.diagnostics;

  return results;
}


export interface TranspileOptions {
  module?: 'None' | 'CommonJS' | 'AMD' | 'System' | 'UMD' | 'ES6' | 'ES2015' | 'ESNext' | string;
  target?: 'ES5' | 'ES6' | 'ES2015' | 'ES2016' | 'ES2017' | 'ESNext' | string;
  [key: string]: any;
}


export interface TranspileResults {
  diagnostics: Diagnostic[];
  code?: string;
}
