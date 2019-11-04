import { Diagnostic } from './diagnostics';


export interface CompileOptions {
  file?: string;
  componentMetadata?: 'runtimestatic' | 'compilerstatic' | string | undefined;
  proxy?: 'defineproperty' | string | undefined;
  module?: 'cjs' | 'esm' | string;
  componentExport?: 'customelement' | 'module' | string | undefined;
  script?: CompileScript;
  style?: 'static' | string | undefined;
  data?: StencilComponentData;
}

export interface CompileResults {
  diagnostics: Diagnostic[];
  code: string;
  map: any;
  inputFilePath: string;
  outputFilePath: string;
  inputOptions: CompileOptions;
  imports: { path: string; }[];
  componentMeta: any[];
}

export interface CompileScriptMinifyOptions {
  script?: CompileScript;
  pretty?: boolean;
}


export type CompileScript = 'latest' | 'esnext' | 'es2017' | 'es2015' | 'es5' | string | undefined;

export interface ResolvedStencilData {
  resolvedId: string;
  resolvedFilePath: string;
  resolvedFileName: string;
  resolvedFileExt: string;
  params: string;
  data: StencilComponentData;
  importee: string;
  importer: string;
  importerExt: string;
}

export interface StencilComponentData {
  tag: string;
  encapsulation?: string;
  mode?: string;
}
