import { BuildConfig, Diagnostic } from '../util/interfaces';
import { transpileModule } from '../compiler/transpile/transpile';


const TEST_CONFIG: BuildConfig = {
  sys: {
    path: require('path'),
    fs: require('fs'),
    typescript: require('typescript'),
    url: require('url'),
    vm: require('vm')
  },
  rootDir: '/'
};


export function transpile(src: string, opts: any, path?: string) {
  const results: TranspileResults = { diagnostics: null, code: null };

  const transpileResults = transpileModule(TEST_CONFIG, src, opts, path);

  results.code = transpileResults.code;
  results.diagnostics = transpileResults.diagnostics;

  return results;
}


export interface TranspileResults {
  diagnostics: Diagnostic[];
  code?: string;
}
