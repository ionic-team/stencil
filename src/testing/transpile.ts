import { Config, Diagnostic } from '../declarations';
import { transpileModule } from '../compiler/transpile/transpile';


const TEST_CONFIG: Config = {
  sys: {
    path: require('path'),
    url: require('url'),
    vm: require('vm')
  },
  rootDir: '/'
};


export function transpile(src: string, opts: any, path?: string) {
  const results: TranspileResults = { diagnostics: null, code: null };
  const transpileResults = transpileModule(TEST_CONFIG, opts, path, src);

  results.code = transpileResults.code;
  results.diagnostics = transpileResults.diagnostics;

  return results;
}


export interface TranspileResults {
  diagnostics: Diagnostic[];
  code?: string;
}
