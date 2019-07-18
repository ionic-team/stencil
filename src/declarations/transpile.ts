import * as d from '.';
import ts from 'typescript';


export interface TranspileResults {
  sourceFilePath: string;
  code: string;
  map: any;
  diagnostics: d.Diagnostic[];
  moduleFile: d.Module;
  build: d.Build;
}


export interface ValidateTypesResults {
  diagnostics: d.Diagnostic[];
  dirPaths: string[];
  filePaths: string[];
}


export interface TransformOptions extends ts.CompilerOptions {
  coreImportPath: string;
  componentMetadata: 'proxy' | 'static' | null;
  styleImport?: 'cjs' | 'esm' | 'inline' | null;
  componentExport?: 'lazy' | 'native' | 'customelement' | null;
}
