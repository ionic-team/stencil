import * as d from '.';

export interface CompileOptions {
  file?: string;
  metadata?: 'proxy' | 'static' | string | undefined;
  mode?: 'dev' | 'prod' | string;
  module?: 'cjs' | 'esm' | string;
  output?: 'customelement' | 'module' | string | undefined;
  script?: CompileScript;
  styleImport?: 'cjs' | 'esm' | 'inline' | string | undefined;
}

export interface CompileResults {
  diagnostics: d.Diagnostic[];
  code: string;
  map: any;
  inputFilePath: string;
  outputFilePath: string;
  inputOptions: CompileOptions;
}

export interface CompileScriptMinifyOptions {
  script?: CompileScript;
  pretty?: boolean;
}


export type CompileScript = 'latest' | 'esnext' | 'es2017' | 'es2015' | 'es5' | string | undefined;
