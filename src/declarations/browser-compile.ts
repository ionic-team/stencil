import * as d from '.';

export interface CompileOptions {
  file?: string;
  componentMetadata?: 'proxy' | 'static' | string | undefined;
  module?: 'cjs' | 'esm' | string;
  componentExport?: 'customelement' | 'module' | string | undefined;
  script?: CompileScript;
  style?: 'import' | 'inline' | string | undefined;
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


export interface ScopeCssOptions {
  commentOriginalSelector?: boolean;
  mode?: string;
}

export interface ScopeCssResults {
  diagnostics: d.Diagnostic[];
  code: string;
  map: any;
}
