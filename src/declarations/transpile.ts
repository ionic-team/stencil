import { Build } from './build-conditionals';
import { Diagnostic } from './diagnostics';
import { Module } from './module';
import ts from 'typescript';


export interface TranspileResults {
  sourceFilePath: string;
  code: string;
  map: any;
  diagnostics: Diagnostic[];
  moduleFile: Module;
  build: Build;
}


export interface ValidateTypesResults {
  diagnostics: Diagnostic[];
  dirPaths: string[];
  filePaths: string[];
}


export interface TransformOptions extends ts.CompilerOptions {
  coreImportPath: string;
  componentExport: 'lazy' | 'native' | 'customelement' | null;
  componentMetadata: 'runtimestatic' | 'compilerstatic' | null;
  proxy: 'defineproperty' | null;
  style: 'static' | null;
}
