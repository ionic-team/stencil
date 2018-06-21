import * as d from '../declarations';
import { mockStencilSystem } from './mocks';
import { transpileModuleForTesting } from '../compiler/transpile/transpile-testing';
import { TestWindowLogger } from './test-window-logger';
import { validateConfig } from '../compiler/config/validate-config';
import * as ts from 'typescript';


const sys = mockStencilSystem();


export function transpile(input: string, opts: TranspileOptions = {}, path?: string) {
  const results: TranspileResults = { diagnostics: null, code: null };

  if (!opts.module) {
    opts.module = 'CommonJS';
  }

  const compilerOpts: ts.CompilerOptions = Object.assign({}, opts as any);

  if (!path) {
    path = '/tmp/transpile.tsx';
  }

  const logger = new TestWindowLogger();

  const config = validateConfig({
    sys: sys,
    logger: logger,
    cwd: process.cwd(),
    rootDir: '/',
    srcDir: '/',
    devMode: true,
    _isTesting: true
  });

  const transpileResults = transpileModuleForTesting(config, compilerOpts, path, input);

  results.code = transpileResults.code;
  results.diagnostics = transpileResults.diagnostics;

  logger.printLogs();

  return results;
}


export interface TranspileOptions {
  module?: 'None' | 'CommonJS' | 'AMD' | 'System' | 'UMD' | 'ES6' | 'ES2015' | 'ESNext' | string;
  target?: 'ES5' | 'ES6' | 'ES2015' | 'ES2016' | 'ES2017' | 'ESNext' | string;
  [key: string]: any;
}


export interface TranspileResults {
  diagnostics: d.Diagnostic[];
  code?: string;
}
