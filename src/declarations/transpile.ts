import { BuildConditionals } from './build-conditionals';
import { Diagnostic } from './diagnostics';
import { Module } from './module';


export interface TranspileResults {
  sourceFilePath: string;
  code: string;
  map: any;
  diagnostics: Diagnostic[];
  moduleFile: Module;
  build: BuildConditionals;
}


export interface ValidateTypesResults {
  diagnostics: Diagnostic[];
  dirPaths: string[];
  filePaths: string[];
}


export interface TransformOptions {
  coreImportPath: string;
  componentExport: 'lazy' | 'native' | 'customelement' | null;
  componentMetadata: 'runtimestatic' | 'compilerstatic' | null;
  proxy: 'defineproperty' | null;
  style: 'static' | null;
  [key: string]: any;
}
